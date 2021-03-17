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

  return await axios.put(`market-baskets/${id}/`, vegaInput)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateMarketBasket
