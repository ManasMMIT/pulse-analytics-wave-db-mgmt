import mapSchemaVegaToMongo from './mapSchemaVegaToMongo'

const PULSE_DEV_COLLECTION = 'marketBaskets'

const upsertSingleMarketBasket = async (marketBasket: any, pulseDevDb: any) => {
  const mongoInput = mapSchemaVegaToMongo(marketBasket)

  return pulseDevDb.collection(PULSE_DEV_COLLECTION).findOneAndUpdate(
    { _id: marketBasket.id },
    { $set: mongoInput },
    { upsert: true, returnOriginal: false },
  )
    .then(({ value }) => [value])
}

export default upsertSingleMarketBasket
