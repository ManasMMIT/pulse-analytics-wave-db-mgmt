import axios from 'axios'

const marketBasketsSubscriptions = (parent, args, context, info) => {
  return axios.get('market-basket-subscriptions/').then(({ data }) => data)
}

export default marketBasketsSubscriptions
