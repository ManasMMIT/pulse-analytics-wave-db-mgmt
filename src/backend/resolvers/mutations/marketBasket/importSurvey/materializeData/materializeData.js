const axios = require('axios')

const getDocsToInsert = require('./getDocsToInsert')

module.exports = async ({ marketBasketId, surveyId, pulseDevDb }) => {
  const surveyQuestionsAndAnswers = await axios.get(
    `hydrated-market-basket-surveys-questions/?survey__id__in=${surveyId}`
  ).then(({ data }) => data)

  const docsToInsert = getDocsToInsert({ surveyQuestionsAndAnswers, surveyId, marketBasketId })

  if (docsToInsert.length) {
    const [{ survey: { date: surveyDate } }] = surveyQuestionsAndAnswers
    await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany({ surveyId, surveyDate })
    await pulseDevDb.collection('marketBasketsSurveyAnswers').insertMany(docsToInsert)
  }
}
