import validateSurveyData from './validateSurveyData'
import upsertRelationalData from './upsertRelationalData'
import materializeData from './materializeData'

const importMarketBasketSurvey = async (
  parent,
  { input },
  { pulseDevDb },
  info
) => {
  // input.surveyId = "39e7f556-6d29-4b18-ac19-ab0c77caaff1" // test surveyId
  await validateSurveyData(input.data)
  await upsertRelationalData(input)
  await materializeData({ ...input, pulseDevDb })

  // TODO: decide to return data from replace job or reformatted input?
  return 'done'
}

export default importMarketBasketSurvey
