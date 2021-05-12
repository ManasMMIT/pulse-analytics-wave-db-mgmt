const axios = require('axios')

const createMarketBasketCategoryCharacteristic = async (
  parent,
  { input },
  context,
  info
) => {
  return await axios.post('market-basket-surveys-categories-characteristics/', input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default createMarketBasketCategoryCharacteristic
