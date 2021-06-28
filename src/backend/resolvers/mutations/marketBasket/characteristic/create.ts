const axios = require('axios')

const createMarketBasketCategoryCharacteristic = async (
  parent,
  { input },
  { pulseDevDb },
  info
) => {
  const createdMarketBasketCharacteristic = await axios.post('market-basket-surveys-categories-characteristics/', input)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBaskets').updateOne(
    { 'categories._id': createdMarketBasketCharacteristic.category },
    {
      $push: {
        'categories.$[category].characteristics': {
          '_id': createdMarketBasketCharacteristic.id,
          'name': createdMarketBasketCharacteristic.name,
          'description': createdMarketBasketCharacteristic.description,
        },
      },
    },
    { arrayFilters: [{ 'category._id': createdMarketBasketCharacteristic.category }] }
  )

  return createdMarketBasketCharacteristic
}

export default createMarketBasketCategoryCharacteristic
