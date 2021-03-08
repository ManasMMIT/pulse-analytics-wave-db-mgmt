const { ObjectId } = require('mongodb')
const _ = require('lodash')
const axios = require('axios')

const upsertUsersPermissions = require('./../sitemap/permissions-upsertion/upsertUsersPermissions')
const deleteTreatmentPlansCascade = require('./../utils/deleteTreatmentPlansCascade')

const deleteSourceRegimen = async (
  parent,
  { input: { _id: regimenId } },
  { mongoClient, coreRoles, pulseCoreDb, pulseDevDb },
  info
) => {
  const _id = ObjectId(regimenId)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    // ! Vega OP
    const { uuid } = await pulseCoreDb.collection('regimens').findOne({ _id })

    if (uuid) {
      await axios.delete(`regimens/${uuid}`).catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })
    }

    // ! Mongo Ops
    // STEP 1: Delete the regimen from all indications
    await pulseCoreDb
      .collection('indications')
      .updateMany(
        { 'regimens._id': _id },
        { $pull: { regimens: { _id } } },
        { session }
      )

    // STEP 2: Delete the regimen from all teams' resources' treatmentPlans' regimens
    await coreRoles.updateMany(
      {
        'resources.treatmentPlans.regimens._id': _id,
      },
      {
        $pull: {
          'resources.$[resource].treatmentPlans.$[].regimens': { _id },
        },
      },
      {
        arrayFilters: [{ 'resource.treatmentPlans': { $exists: true } }],
        session,
      }
    )

    // STEP 3: Regenerate user nodes resources to dev with updated team resources
    // ! find all relevant teams OUTSIDE of transaction (pre-op)
    const teamsWithRegimenResource = await coreRoles
      .find({ 'resources.treatmentPlans.regimens._id': _id })
      .toArray()
    let allTeamUsers = teamsWithRegimenResource.reduce(
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

    // STEP 4: find all treatmentPlans with deleted regimen and handle cascade deletion steps
    const treatmentPlans = await pulseCoreDb
      .collection('treatmentPlans')
      .find({ regimen: _id }, { session })
      .toArray()

    const tpIds = treatmentPlans.map(({ _id }) => _id)

    await deleteTreatmentPlansCascade({
      session,
      pulseCoreDb,
      pulseDevDb,
      treatmentPlanIds: tpIds,
    })

    // STEP 5: Delete the regimen from `regimens` collection
    result = await pulseCoreDb
      .collection('regimens')
      .findOneAndDelete({ _id }, { session })

    result = result.value
  })

  return result
}

module.exports = deleteSourceRegimen
