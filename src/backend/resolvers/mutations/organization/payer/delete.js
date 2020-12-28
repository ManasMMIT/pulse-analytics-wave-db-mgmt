const { ObjectId } = require('mongodb')

const deleteTreatmentPlanConnectionsAndHistory = require('../utils/deleteTreatmentPlanConnectionsAndHistory')

const deletePayerOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseDevDb, pulseCoreDb, pulseProdDb, coreRoles, mongoClient },
  info
) => {
  const _id = ObjectId(stringId)

  const session = mongoClient.startSession()

  let deletedOrg

  await session.withTransaction(async () => {
    // STEP 0: Delete all affiliated org-treatmentPlans and trash historical docs
    await deleteTreatmentPlanConnectionsAndHistory({
      db: pulseCoreDb,
      session,
      organizationId: _id,
    })

    // STEP 1: delete the org from organizations collection
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndDelete({ _id }, { session })

    deletedOrg = value

    // STEP 2: Delete the org across all teams' resources' accounts
    await coreRoles.updateMany(
      {
        'resources.accounts._id': _id,
      },
      {
        $pull: {
          'resources.$[].accounts': { _id },
        },
      },
      { session }
    )

    // STEP 3: Delete the org across all pulse-dev.users.nodes.resources
    await pulseDevDb.collection('users.nodes.resources').updateMany(
      {
        'resources.accounts._id': _id,
      },
      {
        $pull: {
          'resources.$[].accounts': { _id },
        },
      },
      { session }
    )

    // STEP 4: Remove the org from pulse-core connections and pulse-dev providers collection
    const connectionDocs = await pulseCoreDb
      .collection('organizations.connections')
      .find({ orgs: _id }, { session })
      .toArray()

    const connectionIdsToRemove = connectionDocs.map(({ _id }) => _id)

    // if one or more connections targeted for deletion are between a payer and a VBM,
    // that's fine because those deletion ops will merely do nothing to the
    // providers collection in dev (since that only has provider/VBM connections)
    await pulseDevDb
      .collection('newProviders')
      .deleteMany({ _id: { $in: connectionIdsToRemove } }, { session })

    await pulseCoreDb
      .collection('organizations.connections')
      .deleteMany({ orgs: _id }, { session })

    // STEP 5: Delete all obm-payer connections
    await pulseCoreDb
      .collection('JOIN_obms_payers')
      .deleteMany({ payerId: _id }, { session })

    // STEP 6: Cascade delete entries connected to the payer in pulse-dev.obmsPayers
    await pulseDevDb
      .collection('obmsPayers')
      .deleteMany({ 'payer._id': _id }, { session })

    // STEP 7: Delete all lbm-payer connections
    await pulseCoreDb
      .collection('JOIN_lbms_payers')
      .deleteMany({ payerId: _id }, { session })

    // STEP 8: Cascade delete entries connected to the payer in pulse-dev.lbmsPayers
    await pulseDevDb
      .collection('lbmsPayers')
      .deleteMany({ 'payer._id': _id }, { session })

    // STEP 9: delete payer copies in dev
    await pulseDevDb.collection('payers').deleteOne({ _id }, { session })
  })

  return deletedOrg
}

module.exports = deletePayerOrganization
