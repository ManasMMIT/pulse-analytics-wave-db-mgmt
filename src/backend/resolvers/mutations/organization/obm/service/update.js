const { ObjectId } = require('mongodb')

const updateObmService = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  let updatedService

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update service in core
    updatedService = await pulseCoreDb
      .collection('obms.services')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update service subdoc in obmsServices
    // ! does not include relational fields like rating or category
    await pulseDevDb.collection('obmsServices').updateMany(
      { 'service._id': updatedService._id },
      {
        $set: {
          'service.name': body.name,
          'service.description': body.description || null,
        },
      },
      { session }
    )
  })

  return updatedService
}

module.exports = updateObmService
