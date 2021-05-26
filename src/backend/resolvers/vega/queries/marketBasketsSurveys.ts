import axios from 'axios'

const marketBasketsSurveys = (parent, { surveyId, marketBasketId }, context, info) => {
  if (surveyId) {
    return axios.get(`market-basket-surveys/${surveyId}/`)
      .then(({ data }) => [data])
      .catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })
  }

  return axios.get(`market-basket-surveys/?market_basket=${marketBasketId || ''}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default marketBasketsSurveys
