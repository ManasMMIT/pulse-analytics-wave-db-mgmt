import axios from 'axios'

const getCompleteQuestionSet = require('./utils/getCompleteQuestionSet')
const getCompleteAnswerSet = require('./utils/getCompleteAnswerSet')
const getFilledInCompleteAnswerSet = require('./utils/getFilledInCompleteAnswerSet')

const marketBasketSurveyExportData = async (
  parent,
  { marketBasketId, surveyId },
  context,
  info
) => {
  const hydratedMarketBasketOp = axios
    .get(`hydrated-market-baskets/${marketBasketId}/`)
    .then(({ data }) => data)
    .catch(e => { throw new Error(e) })

  const hydratedSurveyQuestionsAnswersOp = axios
    .get(`hydrated-market-basket-surveys-questions/?survey__id__in=${surveyId}`)
    .then(({ data }) => data)
    .catch(e => { throw new Error(e) })

  const [
    hydratedMarketBasket,
    hydratedSurveyQuestionsAnswers,
  ] = await Promise.all([
    hydratedMarketBasketOp,
    hydratedSurveyQuestionsAnswersOp,
  ])

  const completeQuestionSet = getCompleteQuestionSet(
    hydratedMarketBasket.categories,
    hydratedMarketBasket.products_regimens,
  )

  let surveyStakeholders = []

  if (hydratedSurveyQuestionsAnswers.length) {
    const { survey: { stakeholders } } = hydratedSurveyQuestionsAnswers[0]
    surveyStakeholders = stakeholders
  }

  const completeAnswerSet = getCompleteAnswerSet(
    completeQuestionSet,
    surveyStakeholders,
  )

  const filledInCompleteAnswerSet = getFilledInCompleteAnswerSet(
    completeAnswerSet,
    hydratedSurveyQuestionsAnswers,
  )

  return filledInCompleteAnswerSet
}

export default marketBasketSurveyExportData
