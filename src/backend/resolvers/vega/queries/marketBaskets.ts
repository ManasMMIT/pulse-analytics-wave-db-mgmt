import axios from 'axios'
import _ from 'lodash'

const marketBaskets = async (
  parent,
  args,
  context,
  info
) => {
  const marketBaskets = await axios.get(`hydrated-market-baskets/`)

  return _.sortBy(marketBaskets.data, ({ name }) => name.toLowerCase())
}

export default marketBaskets
