import axios from 'axios'

const deleteMarketBasketSurvey = async (
  parent,
  { input: { id: marketBasketSurveyId } },
  context,
  info
) => {
  const marketBasketSurvey = await axios.get(`market-basket-surveys/${marketBasketSurveyId}/`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.delete(`market-basket-surveys/${marketBasketSurveyId}/`).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  return marketBasketSurvey
}

export default deleteMarketBasketSurvey
