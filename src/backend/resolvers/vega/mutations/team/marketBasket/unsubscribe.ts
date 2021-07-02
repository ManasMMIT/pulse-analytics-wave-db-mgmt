import axios from 'axios'

const unSubscribeTeamToMarketBasket = async (
  parent,
  { input },
  context,
  info
) => {
  const subscription = await axios.get(`market-basket-subscriptions/${input.id}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await axios.delete(`market-basket-subscriptions/${input.id}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return subscription
}

export default unSubscribeTeamToMarketBasket
