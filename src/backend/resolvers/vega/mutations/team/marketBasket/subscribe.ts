import axios from 'axios'

const subscribeTeamToMarketBasket = async (
  parent,
  { input },
  context,
  info
) => {
  return axios.post(`market-basket-subscriptions/`, input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default subscribeTeamToMarketBasket
