const axios = require('axios')

const updateMarketBasketSurvey = async (
  parent,
  { input: { id, ...body } },
  context,
  info
) => {
  await axios.patch(`market-basket-surveys/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return axios.get(`market-basket-surveys/${id}/`).then(({ data }) => data)
}

export default updateMarketBasketSurvey
