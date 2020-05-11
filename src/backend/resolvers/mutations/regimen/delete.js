const { ObjectId } = require('mongodb')

const deleteTreatmentPlansCascade = require('./../utils/deleteTreatmentPlansCascade')

const deleteSourceRegimen = async (
  parent,
  { input: { _id: regimenId } },
  { mongoClient, coreRoles, pulseCoreDb },
  info,
) => {
  const _id = ObjectId(regimenId)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    // STEP 1: Delete the regimen from all indications
    await pulseCoreDb.collection('indications').updateMany(
      { 'regimens._id': _id },
      { $pull: { regimens: { _id } } },
      { session },
    )

    // STEP 2: Delete the regimen from all teams' resources' treatmentPlans' regimens
    await coreRoles.updateMany(
      {
        'resources.treatmentPlans.regimens._id': _id,
      },
      {
        $pull: {
          'resources.$[resource].treatmentPlans.$[].regimens': { _id },
        }
      },
      {
        arrayFilters: [
          { 'resource.treatmentPlans': { $exists: true } },
        ],
        session,
      },
    )

    // STEP 3: find all treatmentPlans with deleted regimen and handle cascade deletion steps
    const treatmentPlans = await pulseCoreDb.collection('treatmentPlans')
      .find(
        { regimen: _id },
        { session },
      )
      .toArray()

    const tpIds = treatmentPlans.map(({ _id }) => _id)

    await deleteTreatmentPlansCascade({
      session,
      db: pulseCoreDb,
      treatmentPlanIds: tpIds,
    })

    // STEP 4: Delete the regimen from `regimens` collection
    result = await pulseCoreDb.collection('regimens').findOneAndDelete(
      { _id },
      { session },
    )

    result = result.value
  })

  return result
}

module.exports = deleteSourceRegimen
