import axios from 'axios'

const deleteMarketBasketCategory = async (
  parent,
  { input: { id } },
  context,
  info
) => {
  const categoryToBeDeleted = await axios.get(`market-basket-surveys-categories/${id}/`)
    .then(({ data }) => data)

  await axios.delete(`market-basket-surveys-categories/${id}/`)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return categoryToBeDeleted
}

export default deleteMarketBasketCategory
