const { ObjectId } = require('mongodb')

const deleteSourceIndication = async (
  parent,
  { input: { _id: indicationId } },
  { pulseCoreDb, coreRoles, mongoClient },
  info,
) => {
  const _id = ObjectId(indicationId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    const { value } = await pulseCoreDb.collection('indications').findOneAndDelete(
      { _id },
      { session },
    )

    result = value

    await coreRoles.updateMany(
      {
        'resources.treatmentPlans._id': _id,
      },
      {
        $pull: {
          'resources.$[].treatmentPlans': { _id }
        }
      },
      { session },
    )
  })

  return result
}

module.exports = deleteSourceIndication
