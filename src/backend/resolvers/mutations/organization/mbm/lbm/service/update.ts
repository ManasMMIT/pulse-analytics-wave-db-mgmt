import { ObjectId } from 'mongodb'

const updateLbmService = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = new ObjectId(_id)

  let updatedService

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update service in core
    updatedService = await pulseCoreDb
      .collection('lbms.services')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update service subdoc in lbmsServices
    // ! does not include relational fields like rating or category
    await pulseDevDb.collection('lbmsServices').updateMany(
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

export default updateLbmService
