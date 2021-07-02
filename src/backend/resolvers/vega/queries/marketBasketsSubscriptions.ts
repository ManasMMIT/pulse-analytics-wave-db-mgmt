import axios from 'axios'

const marketBasketsSubscriptions = (parent, { clientTeamId }, context, info) => {
  return axios.get(`market-basket-subscriptions/?team=${clientTeamId || ''}`).then(({ data }) => data)
}

export default marketBasketsSubscriptions
