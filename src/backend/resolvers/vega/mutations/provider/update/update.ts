import axios from 'axios'

import materializeProviderToMarketBasketSurveyAnswers from './materializeProviderToMarketBasketSurveyAnswers'

const updateVegaProvider = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedProvider = await axios.patch(`providers/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await materializeProviderToMarketBasketSurveyAnswers(updatedProvider, pulseDevDb)
  return updatedProvider
}

export default updateVegaProvider


