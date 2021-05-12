import axios from 'axios'
import _ from 'lodash'

const marketBaskets = async (
  parent,
  { marketBasketId },
  context,
  info
) => {
  if (marketBasketId) {
    return axios.get(`hydrated-market-baskets/${marketBasketId}/`).then(({ data }) => [data])
  }

  const marketBaskets = await axios.get(`hydrated-market-baskets/`)

  return _.sortBy(marketBaskets.data, ({ name }) => name.toLowerCase())
}

export default marketBaskets
