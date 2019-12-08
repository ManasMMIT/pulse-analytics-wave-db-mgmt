const { ObjectId } = require('mongodb')

const deleteVbmParticipant = async (
  parent,
  {
    input: {
      _id,
    }
  },
  { pulseCoreDb, mongoClient },
  info,
) => {

  const organizationsCollection = pulseCoreDb.collection('organizations')

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    await organizationsCollection.updateMany(
      { 'connections._id': ObjectId(_id) },
      {
        $pull: {
          connections: { '_id': ObjectId(_id) },
        }
      },
      { session, returnOriginal: false }
    )

    result = ObjectId(_id)
  })

  return result
}

module.exports = deleteVbmParticipant
