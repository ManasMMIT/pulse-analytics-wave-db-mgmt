const axios = require('axios')

const updateMarketBasketCharacteristic = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedMarketBasketCharacteristic = await axios.patch(`market-basket-surveys-categories-characteristics/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBaskets').updateOne(
    { 'categories._id': updatedMarketBasketCharacteristic.category },
    {
      $set: {
        'categories.$[category].characteristics.$[characteristic].name': updatedMarketBasketCharacteristic.name,
        'categories.$[category].characteristics.$[characteristic].description': updatedMarketBasketCharacteristic.description,
      },
    },
    {
      arrayFilters: [
        { 'category._id': updatedMarketBasketCharacteristic.category },
        { 'characteristic._id': id }
      ]
    }
  )

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'characteristic._id': id },
    {
      $set: {
        'characteristic.name': updatedMarketBasketCharacteristic.name,
        'characteristic.description': updatedMarketBasketCharacteristic.description,
      },
    }
  )

  return updatedMarketBasketCharacteristic
}

export default updateMarketBasketCharacteristic
