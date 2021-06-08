const axios = require('axios')

const getSurveyQuestionAnswerPartsMaps = require('./getSurveyQuestionAnswerPartsMaps')
const getRowErrors = require('./getRowErrors')

module.exports = async ({ data, marketBasketId, surveyId }) => {
  const getMarketBasketOp = axios
    .get(`hydrated-market-baskets/${marketBasketId}/`)
    .then(({ data }) => data)
  const getSurveyOp = axios
    .get(`market-basket-surveys/${surveyId}/`)
    .then(({ data }) => data)
  const exportData = await axios
    .get(`market-basket-surveys/${surveyId}/export_template`)
    .then(({ data }) => data)

  const [marketBasket, survey] = await Promise.all([
    getMarketBasketOp,
    getSurveyOp,
  ])

  if (data.length !== exportData.length) {
    throw new Error(
      'Incorrect row count. Additional rows were added or Removed. Please, export again before importing data.'
    )
  }

  const maps = getSurveyQuestionAnswerPartsMaps(survey, marketBasket)

  const rowErrors = getRowErrors(data, maps)

  if (rowErrors.length) throw new Error(JSON.stringify(rowErrors))
}
