import axios from 'axios'

const marketBasketsSurveysStakeholders = (parent, { surveyId }, context, info) => {
  return axios.get(`market-basket-surveys/stakeholders/?survey=${surveyId || ''}`)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })
}

export default marketBasketsSurveysStakeholders
