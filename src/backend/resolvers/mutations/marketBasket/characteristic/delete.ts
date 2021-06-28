import axios from 'axios'

const deleteMarketBasketCharacteristic = async (
  parent,
  { input: { id } },
  { pulseDevDb },
  info
) => {
  const deletedCharacteristic = await axios.get(`market-basket-surveys-categories-characteristics/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`market-basket-surveys-categories-characteristics/${id}/`).catch((e) => {
    throw new Error(JSON.stringify(e.response.data))
  })

  await pulseDevDb.collection('marketBaskets').updateOne(
    { 'categories._id': deletedCharacteristic.category },
    {
      $pull: {
        'categories.$[category].characteristics': { '_id': id },
      },
    },
    { arrayFilters: [{ 'category._id': deletedCharacteristic.category }] }
  )

  await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany(
    { 'characteristic._id': id }
  )

  return deletedCharacteristic
}

export default deleteMarketBasketCharacteristic
