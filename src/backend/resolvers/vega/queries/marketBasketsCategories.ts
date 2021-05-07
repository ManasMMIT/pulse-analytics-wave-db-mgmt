import axios from 'axios'

const marketBasketsCategories = (parent, { marketBasketId }, context, info) => {
  return axios.get(`market-basket-surveys-categories/?market_basket=${marketBasketId || ''}`)
    .then(({ data }) => data)
    .catch(e => e.response.data)
}

export default marketBasketsCategories
