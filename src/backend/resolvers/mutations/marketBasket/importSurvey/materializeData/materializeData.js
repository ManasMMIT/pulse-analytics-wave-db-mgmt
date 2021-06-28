const axios = require('axios')
const _ = require('lodash')

const getDocsToInsert = require('./getDocsToInsert')

module.exports = async ({ surveyId, pulseDevDb, socket }) => {
  socket.emit('Beginning materialization of survey data')
  const surveyQuestionsAndAnswers = await axios
    .get(`market-basket-surveys/${surveyId}/export_template/`)
    .then(({ data }) => data)
  const survey = await axios
    .get(`market-basket-surveys/${surveyId}`)
    .then(({ data }) => data)

  const {
    indication: { id: marketBasketIndicationId },
  } = await axios
    .get(`hydrated-market-baskets/${survey.market_basket}`)
    .then(({ data }) => data)

  const stakeholderSpecialtyMap = survey.stakeholders_full.reduce(
    (acc, { id: personId, role_specialties }) => {
      const indicationSpecialty = role_specialties.find(
        ({ indication: { id: localIndId } }) =>
          localIndId === marketBasketIndicationId
      )
      if (indicationSpecialty) {
        acc[personId] = indicationSpecialty
      }

      return acc
    },
    {}
  )
  const stakeholderMap = _.keyBy(survey.stakeholders_full, 'id')

  const docsToInsert = getDocsToInsert({
    surveyQuestionsAndAnswers,
    survey,
    stakeholderSpecialtyMap,
    stakeholderMap,
  })

  console.log(
    `Removing old, materialized survey data for ${surveyId}:${survey.date}`
  )
  await pulseDevDb
    .collection('marketBasketsSurveyAnswers')
    .deleteMany({ surveyId })

  if (docsToInsert.length) {
    console.log(
      `Adding new, materialized survey data for ${surveyId}:${survey.date}`
    )
    await pulseDevDb
      .collection('marketBasketsSurveyAnswers')
      .insertMany(docsToInsert)
    console.log(`Materialization successfull for ${surveyId}:${survey.date}`)
  }
}
