import axios from 'axios'
import updateMarketBasketSurveyAnswers from './utils/updateMarketBasketSurveyAnswers'

const updateVegaPerson = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const updatedPerson = await axios.patch(`people/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  await updateMarketBasketSurveyAnswers(pulseDevDb, updatedPerson)

  return updatedPerson
}

export default updateVegaPerson
