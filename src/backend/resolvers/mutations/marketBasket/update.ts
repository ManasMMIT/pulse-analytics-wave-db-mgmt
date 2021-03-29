const axios = require('axios')

const updateMarketBasket = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  const vegaInput = {
    ...body,
    team_subscriptions: [],
  }

  await axios.put(`market-baskets/${id}/`, vegaInput)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return axios.get(`hydrated-market-baskets/${id}`).then(({ data }) => data)
}

export default updateMarketBasket
