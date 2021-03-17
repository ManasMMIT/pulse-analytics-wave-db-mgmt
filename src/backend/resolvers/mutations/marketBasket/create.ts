const axios = require('axios')

const createMarketBasket = async (
  parent,
  { input },
  context,
  info
) => {
  const vegaInput = {
    ...input,
    team_subscriptions: [],
  }

  return await axios.post('market-baskets/', vegaInput)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createMarketBasket
