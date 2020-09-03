const { ObjectId } = require('mongodb')

const updateObmServiceCategory = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  let updatedObmServiceCategory

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update core obm service category
    updatedObmServiceCategory = await pulseCoreDb
      .collection('obms.services.categories')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update materialized dev.obmsServices category fields
    await pulseDevDb.collection('obmsServices').updateMany(
      { 'service.categoryId': updatedObmServiceCategory._id },
      {
        $set: {
          'service.category': updatedObmServiceCategory.name,
        },
      },
      { session }
    )
  })

  return updatedObmServiceCategory
}

module.exports = updateObmServiceCategory
