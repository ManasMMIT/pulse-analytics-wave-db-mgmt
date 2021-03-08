const axios = require('axios')
const { v4: uuid } = require('uuid')

const createProduct = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb },
  info
) => {
  // ! Vega Op
  const vegaId = uuid()

  const vegaProductInput = {
    id: vegaId,
    brand_name: body.nameBrand,
    generic_name: body.nameGeneric,
  }

  await axios.post('products/', vegaProductInput).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  // ! Mongo Op
  return pulseCoreDb
    .collection('products')
    .insertOne({ ...body, uuid: vegaId })
    .then((res) => res.ops[0])
}

module.exports = createProduct
