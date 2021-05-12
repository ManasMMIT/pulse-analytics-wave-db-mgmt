const { ObjectId } = require('mongodb')
const axios = require('axios')

const deleteSourceProduct = async (
  parent,
  { input: { _id: productId } },
  { mongoClient, pulseCoreDb },
  info
) => {
  const _id = ObjectId(productId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // ! Vega Op (keeping this as first op on purpose)
    const { uuid } = await pulseCoreDb.collection('products').findOne({ _id })
    if (uuid) {
      await axios.delete(`products/${uuid}/`).catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })
    }

    // ! Mongo Ops
    // delete the product from the products collection
    result = await pulseCoreDb
      .collection('products')
      .findOneAndDelete({ _id }, { session })

    // delete the product from all regimens
    await pulseCoreDb
      .collection('regimens')
      .updateMany(
        { products: { $elemMatch: { _id } } },
        { $pull: { products: { _id } } },
        { session }
      )
  })

  return result.value
}

module.exports = deleteSourceProduct
