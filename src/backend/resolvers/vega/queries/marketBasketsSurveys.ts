import axios from 'axios'

const marketBasketsSurveys = (parent, { marketBasketId }, context, info) => {
  return axios.get(`market-basket-surveys/?market_basket=${marketBasketId || ''}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default marketBasketsSurveys
