const axios = require('axios')

const createMarketBasketSurvey = async (
  parent,
  { input },
  context,
  info
) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  const vegaInput = JSON.stringify({
    ...input,
    stakeholders: [],
  })

  const { id } = await axios.post('market-basket-surveys/', vegaInput, { headers })
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return axios.get(`market-basket-surveys/${id}/`).then(({ data }) => data)
}

export default createMarketBasketSurvey
