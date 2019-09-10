const { ObjectId } = require('mongodb')
const _ = require('lodash')

const updateSourceRegimen = async (
  parent,
  { input: { _id, products, name } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  if (_.isEmpty(products)) throw Error(`'products' field can't be empty`)

  let formattedProducts = products.map(product => (
    { ...product, _id: ObjectId(product._id) }
  ))

  const id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    result = await pulseCoreDb.collection('regimens').findOneAndUpdate(
      { _id: id },
      { $set: { name, products: formattedProducts } },
      { session, returnOriginal: false },
    )

    result = result.value

    // update the regimen for all indications in the indications collection
    await pulseCoreDb.collection('indications').updateMany(
      { regimens: { $elemMatch: { _id: id } } },
      {
        $set: {
          'regimens.$': {
            _id: id,
            name,
            products: formattedProducts,
          }
        }
      }, // only need to update the 1st match in regimens array because they're unique
      { session },
    )
  })

  return result
}

module.exports = updateSourceRegimen
