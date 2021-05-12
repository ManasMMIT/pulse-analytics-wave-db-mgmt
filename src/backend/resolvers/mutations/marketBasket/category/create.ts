const axios = require('axios')

const createMarketBasketCategory = async (
  parent,
  { input },
  context,
  info
) => {
  const vegaInput = {
    ...input,
    characteristics: [],
  }

  return await axios.post('market-basket-surveys-categories/', vegaInput)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createMarketBasketCategory
