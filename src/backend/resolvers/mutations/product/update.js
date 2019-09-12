const { ObjectId } = require('mongodb')

const updateSourceProduct = async (
  parent,
  { input: { _id: productId, ...body } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  const _id = ObjectId(productId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // update the product in the products collection
    result = await pulseCoreDb.collection('products').findOneAndUpdate(
      { _id },
      { $set: body },
      { session, returnOriginal: false },
    )

    // update the product for all regimens in the regimens collection
    await pulseCoreDb.collection('regimens').updateMany(
      { products: { $elemMatch: { _id } } },
      { $set: { 'products.$': { _id, ...body } } }, // only need to update the 1st match in products array because they're unique
      { session }
    )
  })

  return result.value
}

module.exports = updateSourceProduct
