import _ from 'lodash'
import validateSurveyData from './validateSurveyData'
import upsertRelationalData from './upsertRelationalData'
import materializeData from './materializeData'

const SAMPLE_ERRORS = [
  {
    rowIdx: 1,
    column: 'A',
    error: {
      errorMessage: 'PERSON FAILED VALIDATION',
      value: 'Fred Gumm',
      suggestion: 'Fred Yumm'
    },
  },
  {
    rowIdx: 1,
    column: 'F',
    error: {
      errorMessage: 'PRODUCT FAILED VALIDATION: product not included in market basket profile',
      value: 'Fred Gumm',
      suggestion: 'Fred Yumm'
    }
  }
]

const importMarketBasketSurvey = async (
  parent,
  { input },
  { pulseDevDb },
  info
) => {
  await validateSurveyData(input.data)
  // ! Comment in below to test validation error return
  // throw new Error(JSON.stringify(SAMPLE_ERRORS))
  await upsertRelationalData(input)
  console.log('Successfully upserted relation data')
  await materializeData({ ...input, pulseDevDb })

  // TODO: decide to return data from replace job or reformatted input?
  return 'done'
}

export default importMarketBasketSurvey
