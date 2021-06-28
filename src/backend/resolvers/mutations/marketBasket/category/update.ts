const axios = require('axios')

const updateMarketBasketCategory = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedMarketBasketCategory = await axios.patch(`market-basket-surveys-categories/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBaskets').updateOne(
    { '_id': updatedMarketBasketCategory.market_basket },
    {
      $set: {
        'categories.$[category].name': updatedMarketBasketCategory.name,
        'categories.$[category].prompt': updatedMarketBasketCategory.prompt,
        'categories.$[category].characteristics': updatedMarketBasketCategory.characteristics_full.map(
          ({ id, name, description }) => ({ _id: id, name, description })
        ),
      },
    },
    { arrayFilters: [{ 'category._id': id }] }
  )

  await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
    { 'category._id': id },
    {
      $set: {
        'category.name': updatedMarketBasketCategory.name,
        'category.prompt': updatedMarketBasketCategory.prompt,
      },
    }
  )

  return updatedMarketBasketCategory
}

export default updateMarketBasketCategory
