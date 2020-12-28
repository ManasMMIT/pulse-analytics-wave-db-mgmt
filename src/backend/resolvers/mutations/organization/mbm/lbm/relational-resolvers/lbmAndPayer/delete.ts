import { ObjectId } from 'mongodb'

const deleteLbmAndPayerConnection = async (
  parent,
  { input: { _id } },
  { pulseCoreDb, pulseDevDb, mongoClient }
) => {
  _id = new ObjectId(_id)

  const session = mongoClient.startSession()

  let deletedConnection

  await session.withTransaction(async () => {
    deletedConnection = await pulseCoreDb
      .collection('JOIN_lbms_payers')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    await pulseDevDb.collection('lbmsPayers').deleteOne({ _id }, { session })
  })

  return deletedConnection
}

export default deleteLbmAndPayerConnection
