const _ = require('lodash')
const { ObjectId } = require('mongodb')
const axios = require('axios')
const { v4: uuid } = require('uuid')

const createRegimen = async (
  parent,
  { input: { name, products } },
  { pulseCoreDb },
  info
) => {
  if (_.isEmpty(products)) throw Error(`'products' field can't be empty`)

  // ! VEGA POST OP
  const vegaId = uuid()

  const vegaProducts = products.reduce((acc, product) => {
    if (product.uuid) return [...acc, product.uuid]

    return acc
  }, [])

  const vegaRegimenInput = {
    id: vegaId,
    name,
    product_set: vegaProducts,
  }

  await axios.post('regimens/', vegaRegimenInput).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  // ! MONGO OP
  let formattedProducts = products.map((product) => ({
    ...product,
    _id: ObjectId(product._id),
  }))

  // TODO: consider DB or resolver level constraint for 'name' uniqueness
  return pulseCoreDb
    .collection('regimens')
    .insertOne({ name, products: formattedProducts, uuid: vegaId })
    .then((res) => res.ops[0])
}

module.exports = createRegimen
