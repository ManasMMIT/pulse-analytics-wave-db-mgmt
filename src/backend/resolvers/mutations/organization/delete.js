const { ObjectId } = require('mongodb')

const deleteTreatmentPlanConnectionsAndHistory = require('./utils/deleteTreatmentPlanConnectionsAndHistory')
const basicOrgDeletionOps = require('./basicOrgDeletionOps')

const deleteOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseDevDb, pulseCoreDb, coreRoles, mongoClient },
  info
) => {
  const _id = ObjectId(stringId)

  const session = mongoClient.startSession()

  let deletedOrg

  await session.withTransaction(async () => {
    // STEP 1: Delete all affiliated org-treatmentPlans and trash historical docs
    await deleteTreatmentPlanConnectionsAndHistory({
      db: pulseCoreDb,
      session,
      organizationId: _id,
    })

    // STEP 2: delete the org from core organizations and permissions collections
    deletedOrg = await basicOrgDeletionOps(_id, {
      pulseCoreDb,
      session,
      pulseDevDb,
    })

    // STEP 3: Remove the org from pulse-core connections and pulse-dev providers collection
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

    await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
      { 'stakeholder.providerId': deletedOrg.uuid },
      {
        $set: {
          'stakeholder.providerType': null,
          'stakeholder.providerId': null,
          'stakeholder.providerInstitutions': null,
          'stakeholder.providerCommunityPracticeNetwork': null,
        },
      }
    )

    await pulseCoreDb
      .collection('organizations.connections')
      .deleteMany({ orgs: _id }, { session })
  })

  return deletedOrg
}

module.exports = deleteOrganization
