import { ObjectId } from 'mongodb'

const updateLbmServiceCategory = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = new ObjectId(_id)

  let updatedLbmServiceCategory

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update core lbm service category
    updatedLbmServiceCategory = await pulseCoreDb
      .collection('lbms.services.categories')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update materialized dev.lbmsServices category fields
    await pulseDevDb.collection('lbmsServices').updateMany(
      { 'service.categoryId': updatedLbmServiceCategory._id },
      {
        $set: {
          'service.category': updatedLbmServiceCategory.name,
        },
      },
      { session }
    )
  })

  return updatedLbmServiceCategory
}

export default updateLbmServiceCategory
