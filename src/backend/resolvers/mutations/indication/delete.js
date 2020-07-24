const { ObjectId } = require('mongodb')
const _ = require('lodash')

const upsertUsersPermissions = require('./../sitemap/permissions-upsertion/upsertUsersPermissions')
const deleteTreatmentPlansCascade = require('./../utils/deleteTreatmentPlansCascade')

const deleteSourceIndication = async (
  parent,
  { input: { _id: indicationId } },
  { pulseDevDb, pulseCoreDb, coreRoles, mongoClient },
  info
) => {
  const _id = ObjectId(indicationId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // STEP 1: remove all indications (with nested regimens) from roles' resources
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

    // STEP 2: Regenerate user nodes resources to dev with updated team resources
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

    // STEP 3: find all treatmentPlans with deleted indication and handle treatmentPlan deletion cascade
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

    // STEP 4: delete indication itself
    const { value } = await pulseCoreDb
      .collection('indications')
      .deleteOne({ _id }, { session })

    result = value
  })

  return result
}

module.exports = deleteSourceIndication
