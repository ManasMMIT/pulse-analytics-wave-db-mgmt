const axios = require('axios')
const { v4: uuid4 } = require('uuid')

module.exports = async (dbs) => {
  const pulseCoreDb = dbs.db('pulse-core')
  const coreProductsWithRegimens = await pulseCoreDb
    .collection('products')
    .aggregate(JOIN_PROD_REG_PIP)
    .toArray()

  for (const { _id, ...body } of coreProductsWithRegimens) {
    const uuid = uuid4()
    const regimens = (body.regimens || []).map(({ uuid }) => uuid)

    const vegaProductInput = {
      id: uuid,
      brand_name: body.nameBrand,
      generic_name: body.nameGeneric,
      regimens,
    }

    await axios.post('products/', vegaProductInput)
      .catch(e => { JSON.stringify(e.response.data) })

    await pulseCoreDb.collection('products')
      .updateOne({ _id }, { $set: { uuid } })
  }

  console.log('Mongo products\' uuids populated + Vega products w/ regimen associations seeded')
}

const JOIN_PROD_REG_PIP = [
  {
    '$lookup': {
      'from': 'regimens',
      'localField': '_id',
      'foreignField': 'products._id',
      'as': 'regimens'
    }
  }
]
