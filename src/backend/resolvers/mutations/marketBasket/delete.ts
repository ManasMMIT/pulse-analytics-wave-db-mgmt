import axios from 'axios'

const deleteMarketBasket = async (
  parent,
  { input: { id: marketBasketId } },
  context,
  info
) => {
  const hydratedMarketBasket = await axios.get(`market-baskets/${marketBasketId}`)
    .then(({ data }) => data)

  await axios.delete(`market-baskets/${marketBasketId}`).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  return hydratedMarketBasket
}

export default deleteMarketBasket
