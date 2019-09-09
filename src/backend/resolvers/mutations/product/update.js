const { ObjectId } = require('mongodb')

const updateSourceProduct = async (
  parent,
  { input: { _id, ...body } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  const id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // update the product in the products collection
    result = await pulseCoreDb.collection('products').findOneAndUpdate(
      { _id: id },
      { $set: body },
      { session, returnOriginal: false },
    )

    // update the product for all regimens in the regimens collection
    await pulseCoreDb.collection('regimens').updateMany(
      { products: { $elemMatch: { _id: id } } },
      { $set: { 'products.$': { _id: id, ...body } } }, // only need to update the 1st match in products array because they're unique
      { session }
    )
  })

  return result.value
}

module.exports = updateSourceProduct
