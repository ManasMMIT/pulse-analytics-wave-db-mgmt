import upsertSingleMarketBasket from './utils/upsertSingleMarketBasket'

const axios = require('axios')

const updateMarketBasket = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  await axios.patch(`market-baskets/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  const hydratedMarketBasket = await axios.get(`hydrated-market-baskets/${id}/`).then(({ data }) => data)
  await upsertSingleMarketBasket(hydratedMarketBasket, pulseDevDb)

  return hydratedMarketBasket
}

export default updateMarketBasket
