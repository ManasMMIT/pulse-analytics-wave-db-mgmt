const { ObjectId } = require('mongodb')
const _ = require('lodash')

const upsertUsersPermissions = require('./../sitemap/permissions-upsertion/upsertUsersPermissions')
const deleteTreatmentPlansCascade = require('./../utils/deleteTreatmentPlansCascade')

const EventProcessor = require('../shared/Event/EventProcessor')
const PathwaysAndPersonConnection = require('../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnection')
const PathwaysAndPersonConnectionUpsertionEvent = require('../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnectionUpsertionEvent')

const deleteSourceIndication = async (
  parent,
  { input: { _id: indicationId } },
  { pulseDevDb, pulseCoreDb, coreRoles, mongoClient, user },
  info
) => {
  const _id = ObjectId(indicationId)

  let deletedIndication

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // STEP 1: delete indication itself
    deletedIndication = await pulseCoreDb
      .collection('indications')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // STEP 2: remove all indications (with nested regimens) from roles' resources
    await coreRoles.updateMany(
      {
        'resources.treatmentPlans._id': _id,
      },
      {
        $pull: {
          'resources.$[].treatmentPlans': { _id },
        },
      },
      { session }
    )

    // STEP 3: Regenerate user nodes resources to dev with updated team resources
    // ! find all relevant teams OUTSIDE of transaction (pre-op)
    const teamsWithIndicationResource = await coreRoles
      .find({ 'resources.treatmentPlans._id': _id })
      .toArray()

    let allTeamUsers = teamsWithIndicationResource.reduce(
      (acc, { users }) => [...acc, ...users],
      []
    )

    allTeamUsers = _.uniqBy(allTeamUsers, '_id')

    // ! might take longer than a minute and error on frontend
    await upsertUsersPermissions({
      users: allTeamUsers,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    // STEP 4: Delete the indication-therapeuticArea combo tied to this indication
    // in the materialized pulse-dev.indicationsTherapeuticAreas collection; the _id
    // should correspond one-to-one to the indication doc in core
    await pulseDevDb
      .collection('indicationsTherapeuticAreas')
      .deleteOne({ _id }, { session })

    // STEP 5: find all treatmentPlans with deleted indication and handle
    // treatmentPlan deletion cascade
    const treatmentPlans = await pulseCoreDb
      .collection('treatmentPlans')
      .find({ indication: _id }, { session })
      .toArray()

    const tpIds = treatmentPlans.map(({ _id }) => _id)

    await deleteTreatmentPlansCascade({
      pulseCoreDb,
      pulseDevDb,
      treatmentPlanIds: tpIds,
      session,
    })

    // STEP 6: Delete all instances of the indication in JOIN_pathways_people in core and
    // the corresponding materialized collection in dev
    const connectionsToUpdate = await pulseCoreDb
      .collection('JOIN_pathways_people')
      .find({ indicationIds: _id })
      .toArray()

    const editedConnections = connectionsToUpdate.map((connection) => ({
      ...connection,
      indicationIds: connection.indicationIds.filter(
        (indId) => !indId.equals(_id)
      ),
    }))

    const updateOps = editedConnections.map(async (editedConnection) => {
      const connection = await PathwaysAndPersonConnection.init({
        data: editedConnection,
        dbs: { pulseCoreDb, pulseDevDb },
      })

      const event = new PathwaysAndPersonConnectionUpsertionEvent(
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

    await Promise.all(updateOps)

    await pulseDevDb
      .collection('pathwaysInfluencers')
      .updateMany(
        { indication: deletedIndication.name },
        { $pull: { indication: deletedIndication.name } },
        { session }
      )
  })

  return deletedIndication
}

module.exports = deleteSourceIndication
