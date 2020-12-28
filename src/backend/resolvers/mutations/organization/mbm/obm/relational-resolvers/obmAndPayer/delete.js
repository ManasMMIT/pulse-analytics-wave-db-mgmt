const { ObjectId } = require('mongodb')

const deleteObmAndPayerConnection = async (
  parent,
  { input: { _id } },
  { pulseCoreDb, pulseDevDb, mongoClient }
) => {
  _id = ObjectId(_id)

  const session = mongoClient.startSession()

  let deletedConnection

  await session.withTransaction(async () => {
    deletedConnection = await pulseCoreDb
      .collection('JOIN_obms_payers')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    await pulseDevDb.collection('obmsPayers').deleteOne({ _id }, { session })
  })

  return deletedConnection
}

module.exports = deleteObmAndPayerConnection
