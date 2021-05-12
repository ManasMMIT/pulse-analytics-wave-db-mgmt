const axios = require('axios')

const updateMarketBasketCategory = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  return axios.patch(`market-basket-surveys-categories/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default updateMarketBasketCategory
