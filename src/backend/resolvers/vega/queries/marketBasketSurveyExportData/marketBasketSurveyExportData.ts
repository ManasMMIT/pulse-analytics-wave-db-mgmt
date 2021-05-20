import axios from 'axios'

import SurveyExportEmitter from './SurveyExportEmitter'

const getCompleteQuestionSet = require('./utils/getCompleteQuestionSet')
const getCompleteAnswerSet = require('./utils/getCompleteAnswerSet')
const getFilledInCompleteAnswerSet = require('./utils/getFilledInCompleteAnswerSet')

const PROJECT_NAME = 'generating export data'
const SOCKET_PROJECT_ID = 'GENERATE_SURVEY_DATA_EXPORT'

const marketBasketSurveyExportData = async (
  parent,
  { marketBasketId, surveyId },
  { user, io },
  info
) => {
  const socketEmitId = `${SOCKET_PROJECT_ID}_${user.user_id}_${surveyId}`
  const surveyExportEmitter = new SurveyExportEmitter(io, PROJECT_NAME, socketEmitId)

  surveyExportEmitter.start()

  const hydratedMarketBasketOp = axios
    .get(`hydrated-market-baskets/${marketBasketId}/`)
    .then(({ data }) => data)
    .catch(e => {
      surveyExportEmitter.error()
      throw new Error(e)
    })

  const hydratedSurveyQuestionsAnswersOp = axios
    .get(`hydrated-market-basket-surveys-questions/?survey__id__in=${surveyId}`)
    .then(({ data }) => data)
    .catch(e => {
      surveyExportEmitter.error()
      throw new Error(e)
    })

  const marketBasketSurveyOp = axios
    .get(`market-basket-surveys/${surveyId}/`)
    .then(({ data }) => data)
    .catch(e => {
      surveyExportEmitter.error()
      throw new Error(e)
    })

  const [
    hydratedMarketBasket,
    hydratedSurveyQuestionsAnswers,
    marketBasketSurvey,
  ] = await Promise.all([
    hydratedMarketBasketOp,
    hydratedSurveyQuestionsAnswersOp,
    marketBasketSurveyOp,
  ])

  const completeQuestionSet = getCompleteQuestionSet(
    hydratedMarketBasket.categories,
    hydratedMarketBasket.products_regimens,
  )

  let { stakeholders_full: surveyStakeholders } = marketBasketSurvey

  const completeAnswerSet = getCompleteAnswerSet(
    completeQuestionSet,
    surveyStakeholders,
  )

  const filledInCompleteAnswerSet = getFilledInCompleteAnswerSet(
    completeAnswerSet,
    hydratedSurveyQuestionsAnswers,
  )

  surveyExportEmitter.success()

  return filledInCompleteAnswerSet
}

export default marketBasketSurveyExportData
