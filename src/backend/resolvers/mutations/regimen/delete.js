const { ObjectId } = require('mongodb')

const deleteSourceRegimen = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  const id = ObjectId(_id)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    result = await pulseCoreDb.collection('regimens').findOneAndDelete(
      { _id: id },
      { session },
    )

    result = result.value

    // delete the regimen from all indications
    await pulseCoreDb.collection('indications').updateMany(
      { regimens: { $elemMatch: { _id: id } } },
      { $pull: { regimens: { _id: id } } },
      { session },
    )
  })

  return result
}

module.exports = deleteSourceRegimen
