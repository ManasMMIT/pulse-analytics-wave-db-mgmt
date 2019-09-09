const { ObjectId } = require('mongodb')
const _ = require('lodash')

const updateSourceRegimen = async (
  parent,
  { input: { _id, products, name } },
  { pulseCoreDb },
  info,
) => {
  if (_.isEmpty(products)) throw Error(`'products' field can't be empty`)

  let formattedProducts = products.map(product => (
    { ...product, _id: ObjectId(product._id) }
  ))

  let result = await pulseCoreDb.collection('regimens').findOneAndUpdate(
    { _id: ObjectId(_id) },
    { $set: { name, products: formattedProducts } },
    { returnOriginal: false },
  )

  result = result.value

  return result
}

module.exports = updateSourceRegimen
