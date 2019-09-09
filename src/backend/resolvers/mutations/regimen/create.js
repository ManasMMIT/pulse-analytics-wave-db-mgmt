const _ = require('lodash')
const { ObjectId } = require('mongodb')

const createRegimen = (
  parent,
  { input: { name, products } },
  { pulseCoreDb },
  info
) => {
  if (_.isEmpty(products)) throw Error(`'products' field can't be empty`)

  let formattedProducts = products.map(product => (
    { ...product, _id: ObjectId(product._id) }
  ))

  // TODO: consider DB or resolver level constraint for 'name' uniqueness
  return pulseCoreDb.collection('regimens').insertOne({ name, products: formattedProducts })
    .then(res => res.ops[0])
}

module.exports = createRegimen
