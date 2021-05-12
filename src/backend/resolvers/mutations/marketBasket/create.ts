const axios = require('axios')

const createMarketBasket = async (
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
    team_subscriptions: [],
    categories: [],
    question_rating_range: "{\"bounds\": \"[)\", \"lower\": \"0\", \"upper\": \"5\"}",
  })

  const { id } = await axios.post('market-baskets/', vegaInput, { headers })
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  return axios.get(`hydrated-market-baskets/${id}/`).then(({ data }) => data)
}

export default createMarketBasket
