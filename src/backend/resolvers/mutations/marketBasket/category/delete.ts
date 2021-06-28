import axios from 'axios'

const deleteMarketBasketCategory = async (
  parent,
  { input: { id } },
  { pulseDevDb },
  info
) => {
  const categoryToBeDeleted = await axios.get(`market-basket-surveys-categories/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`market-basket-surveys-categories/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await pulseDevDb.collection('marketBaskets').updateOne(
    { '_id': categoryToBeDeleted.market_basket },
    {
      $pull: {
        'categories': { '_id': id },
      },
    }
  )

  await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany(
    { 'category._id': id }
  )

  return categoryToBeDeleted
}

export default deleteMarketBasketCategory
