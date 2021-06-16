import axios from 'axios'

import upsertSingleMarketBasket from '../utils/upsertSingleMarketBasket'
import updateSingleMarketBasketSurveyData from './updateSingleMarketBasketSurveyData'

const removeSingleMarketBasketSurveyData = require('./removeSingleMarketBasketSurveyData')

const pushMarketBasketsToDev = async (
  parent,
  { input: { marketBasketId } },
  { pulseDevDb },
  info
) => {
  const marketBasket = await axios
    .get(`hydrated-market-baskets/${marketBasketId}/`)
    .then(({ data }) => data)

  const upsertSingleMarketBasketResult = await upsertSingleMarketBasket(marketBasket, pulseDevDb)
  await removeSingleMarketBasketSurveyData(marketBasket, pulseDevDb)
  await updateSingleMarketBasketSurveyData(marketBasket, pulseDevDb)
  return upsertSingleMarketBasketResult
}

export default pushMarketBasketsToDev
