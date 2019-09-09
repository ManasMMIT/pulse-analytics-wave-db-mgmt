const { ObjectId } = require('mongodb')

const deleteSourceProduct = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  const id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // delete the product from the products collection
    result = await pulseCoreDb.collection('products').findOneAndDelete(
      { _id: id },
      { session },
    )

    // delete the product from all regimens
    await pulseCoreDb.collection('regimens').updateMany(
      { products: { $elemMatch: { _id: id } } },
      { $pull: { products: { _id: id } } },
      { session }
    )
  })

  return result.value
}

module.exports = deleteSourceProduct
