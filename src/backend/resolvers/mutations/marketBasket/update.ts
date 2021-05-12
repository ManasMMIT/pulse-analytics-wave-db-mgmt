const axios = require('axios')

const updateMarketBasket = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  await axios.patch(`market-baskets/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return axios.get(`hydrated-market-baskets/${id}/`).then(({ data }) => data)
}

export default updateMarketBasket
