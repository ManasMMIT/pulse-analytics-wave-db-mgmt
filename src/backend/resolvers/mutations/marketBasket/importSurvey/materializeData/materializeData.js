const axios = require('axios')

const getDocsToInsert = require('./getDocsToInsert')

module.exports = async ({ surveyId, pulseDevDb }) => {
  console.log('Beginning materialization of survey data')
  const surveyQuestionsAndAnswers = await axios
    .get(`market-basket-surveys/${surveyId}/export_template/`)
    .then(({ data }) => data)
  const survey = await axios
    .get(`market-basket-surveys/${surveyId}`)
    .then(({ data }) => data)

  const docsToInsert = getDocsToInsert({ surveyQuestionsAndAnswers, survey })

  if (docsToInsert.length) {
    console.log(
      `Removing old, materialized survey data for ${surveyId}:${survey.date}`
    )
    await pulseDevDb
      .collection('TEMP_marketBasketsSurveyAnswers')
      .deleteMany({ surveyId })
    console.log(
      `Adding new, materialized survey data for ${surveyId}:${survey.date}`
    )
    await pulseDevDb
      .collection('TEMP_marketBasketsSurveyAnswers')
      .insertMany(docsToInsert)
    console.log(`Materialization successfull for ${surveyId}:${survey.date}`)
  }
}
