import _ from 'lodash'
import validateSurveyData from './validateSurveyData'
import upsertRelationalData from './upsertRelationalData'
import materializeData from './materializeData'

const importMarketBasketSurvey = async (
  parent,
  { input },
  { pulseDevDb },
  info
) => {
  console.log('Validating sheet data')
  await validateSurveyData(input)
  console.log('Sheet data validated')
  await upsertRelationalData(input)
  console.log('Successfully upserted relation data')
  await materializeData({ ...input, pulseDevDb })

  // TODO: decide to return data from replace job or reformatted input?
  return 'done'
}

export default importMarketBasketSurvey
