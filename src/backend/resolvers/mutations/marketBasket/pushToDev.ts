const axios = require('axios')

const VEGA_ENDPOINT = 'hydrated-market-baskets'
const PULSE_DEV_COLLECTION = 'marketBaskets'

const pushMarketBasketsToDev = async (
  parent,
  { input: { marketBasketId } },
  { pulseDevDb },
  info
) => {
  const marketBasketsCollection = pulseDevDb.collection(PULSE_DEV_COLLECTION)
  const date = new Date()

  if (marketBasketId) {
    return upsertSingleMarketBasket(
      marketBasketId,
      marketBasketsCollection,
      date,
    )
  } else {
    return await dropAndReplaceMarketBaskets(marketBasketsCollection, date)
  }
}

export default pushMarketBasketsToDev

const upsertSingleMarketBasket = async (marketBasketId: any, marketBasketsCollection: any, date: any) => {
  const marketBasket = await axios
    .get(`${VEGA_ENDPOINT}/${marketBasketId}`)
    .then(({ data }) => data)

  const mongoInput = mapSchemaVegaToMongo(marketBasket, date)

  return marketBasketsCollection.findOneAndUpdate(
    { _id: marketBasketId },
    { $set: mongoInput },
    { upsert: true, returnOriginal: false },
  )
    .then(({ value }) => [value])
}

const dropAndReplaceMarketBaskets = async (marketBasketsCollection: any, date: any) => {
  const marketBaskets = await axios.get(VEGA_ENDPOINT).then(({ data }) => data)
  const documentsToInsert = marketBaskets.map((marketBasket) => mapSchemaVegaToMongo(marketBasket, date))

  await marketBasketsCollection.deleteMany()
  await marketBasketsCollection.insertMany(documentsToInsert)

  return documentsToInsert
}


const mapSchemaVegaToMongo = ({
  id,
  name,
  description,
  products_regimens,
  categories,
}, date) => {
  const productsRegimens = products_regimens.map(({
    id,
    product,
    regimen,
  }) => ({
    id,
    product: {
      _id: product.id,
      brandName: product.brand_name,
      genericName: product.generic_name,
      logoLink: product.logo_link,
    },
    regimen: {
      _id: regimen.id,
      name: regimen.name,
    }
  }))

  const mongoCategories = categories.map(({
    id,
    name,
    prompt,
  }) => ({
    _id: id,
    name,
    prompt,
  }))

  return {
    _id: id,
    name,
    description,
    productsRegimens,
    categories: mongoCategories,
    materialized_at: date,
  }
}

