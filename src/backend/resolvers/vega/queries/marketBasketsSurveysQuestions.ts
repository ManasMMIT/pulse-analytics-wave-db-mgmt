import axios from 'axios'

const marketBasketsSurveysQuestions = (parent, { surveyId }, context, info) => {
  return axios.get(`hydrated-market-basket-surveys-questions/?survey__id__in=${surveyId || ''}`)
    .then(({ data }) => data)
    .catch(e => e.response.data)
}

export default marketBasketsSurveysQuestions
