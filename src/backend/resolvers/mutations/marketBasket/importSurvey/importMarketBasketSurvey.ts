import validateSurveyData from './validateSurveyData'
import replaceRelationalData from './replaceRelationalData'
import materializeData from './materializeData'

const importMarketBasketSurvey = async (
  parent,
  { input },
  { pulseDevDb },
  info
) => {
  await validateSurveyData(input.data)
  await replaceRelationalData(input)
  await materializeData(input.data, pulseDevDb)

  // TODO: decide to return data from replace job or reformated input?
  return 'done'
}

export default importMarketBasketSurvey
