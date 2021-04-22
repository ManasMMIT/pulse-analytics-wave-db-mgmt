const { ObjectId } = require('mongodb')
const axios = require('axios')

const updateSourceProduct = async (
  parent,
  { input: { _id: productId, ...body } },
  { mongoClient, pulseCoreDb },
  info
) => {
  const _id = ObjectId(productId)
  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // ! Vega OP
    const { uuid } = await pulseCoreDb.collection('products').findOne({ _id })

    if (uuid) {
      const vegaInput = {
        brand_name: body.nameBrand,
        generic_name: body.nameGeneric,
      }

      await axios.patch(`products/${uuid}/`, vegaInput).catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })
    }

    // ! Mongo Op
    // update the product in the products collection
    result = await pulseCoreDb
      .collection('products')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { session, returnOriginal: false }
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
