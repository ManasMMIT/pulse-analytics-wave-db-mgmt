import axios from 'axios'

const deleteMarketBasket = async (
  parent,
  { input: { id: marketBasketId } },
  { pulseDevDb },
  info
) => {
  const hydratedMarketBasket = await axios.get(`hydrated-market-baskets/${marketBasketId}/`)
    .then(({ data }) => data)

  await axios.delete(`market-baskets/${marketBasketId}/`).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  const deleteMbOp = pulseDevDb.collection('marketBaskets')
    .deleteOne({ _id: marketBasketId })
  const deleteMbSurveyDataOp = pulseDevDb.collection('marketBasketsSurveyAnswers')
    .deleteMany({ marketBasketId: marketBasketId })

  await Promise.all([deleteMbOp, deleteMbSurveyDataOp])

  return hydratedMarketBasket
}

export default deleteMarketBasket
