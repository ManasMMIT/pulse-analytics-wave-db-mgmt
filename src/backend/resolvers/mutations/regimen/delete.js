const { ObjectId } = require('mongodb')

const deleteSourceRegimen = async (
  parent,
  { input: { _id: regimenId } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  const _id = ObjectId(regimenId)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    result = await pulseCoreDb.collection('regimens').findOneAndDelete(
      { _id },
      { session },
    )

    result = result.value

    // delete the regimen from all indications
    await pulseCoreDb.collection('indications').updateMany(
      { regimens: { $elemMatch: { _id } } },
      { $pull: { regimens: { _id } } },
      { session },
    )
  })

  return result
}

module.exports = deleteSourceRegimen
