const { ObjectId } = require('mongodb')

const PathwaysAndPersonConnection = require('../../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnection')
const PathwaysAndPersonConnectionDeletionEvent = require('../../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnectionDeletionEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const deleteTreatmentPlanConnectionsAndHistory = require('../utils/deleteTreatmentPlanConnectionsAndHistory')

const deletePathwaysOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseDevDb, pulseCoreDb, coreRoles, mongoClient, user },
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

    // STEP 5: Instantiate and process as many instances of PathwaysAndPersonConnectionDeletionEvent
    // as needed for deleting the connected docs in pulse-core.JOIN_pathways_people.
    const connectionsToDelete = await pulseCoreDb
      .collection('JOIN_pathways_people')
      .find({ pathwaysId: _id })
      .toArray()

    const deletionOps = connectionsToDelete.map(async (connectionToDelete) => {
      const connection = await PathwaysAndPersonConnection.init({
        data: connectionToDelete,
        dbs: { pulseCoreDb, pulseDevDb },
      })

      const event = new PathwaysAndPersonConnectionDeletionEvent(
        user,
        connection
      )

      const eventProc = new EventProcessor()

      await eventProc.process({
        event,
        dbs: { pulseCoreDb },
        session,
      })
    })

    await Promise.all(deletionOps)

    // STEP 6: Delete the same connections from the materialized
    // pulse-dev.pathwaysInfluencers collection.
    await pulseDevDb
      .collection('pathwaysInfluencers')
      .deleteMany({ pathwaysId: _id }, { session })
  })

  return deletedOrg
}

module.exports = deletePathwaysOrganization
