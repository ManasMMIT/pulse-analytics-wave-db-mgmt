const { ObjectId } = require('mongodb')

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
    // STEP 1: Delete the regimen from regimens collection
    result = await pulseCoreDb.collection('regimens').findOneAndDelete(
      { _id },
      { session },
    )

    result = result.value

    // STEP 2: Delete the regimen from all indications
    await pulseCoreDb.collection('indications').updateMany(
      { 'regimens._id': _id },
      { $pull: { regimens: { _id } } },
      { session },
    )

    // STEP 3: Delete the regimen from all teams' resources' treatmentPlans' regimens
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
  })

  return result
}

module.exports = deleteSourceRegimen
