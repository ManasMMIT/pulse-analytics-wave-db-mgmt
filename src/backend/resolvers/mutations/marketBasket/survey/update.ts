const axios = require('axios')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../utils/defaultTimeZone')

const updateMarketBasketSurvey = async (
  parent,
  { input: { id, ...body } },
  { pulseDevDb },
  info
) => {
  const { date, ...rest } = body

  if (date) {
    const standardizedDate = zonedTimeToUtc(date, DEFAULT_TIMEZONE)
    body = { date: standardizedDate, ...rest }
  }

  const marketBasketSurvey = await axios.patch(`market-basket-surveys/${id}/`, body)
    .then(({ data }) => data)
    .catch((e) => {
      throw new Error(JSON.stringify(e.response.data))
    })

  if (body.date) {
    await pulseDevDb.collection('marketBasketsSurveyAnswers').updateMany(
      { surveyId: id },
      { $set: { surveyDate: body.date } }
    )
  }

  await pulseDevDb.collection('marketBasketsSurveyAnswers').deleteMany({
    surveyId: id,
    'stakeholder._id': { $nin: marketBasketSurvey.stakeholders }
  })

  return marketBasketSurvey
}

export default updateMarketBasketSurvey
