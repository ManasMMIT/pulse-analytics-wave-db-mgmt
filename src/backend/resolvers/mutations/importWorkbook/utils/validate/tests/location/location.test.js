const validate = require('../..')
const formatAjvErrors = require('../../../formatAjvErrors')

// * Mock the custom module that hits the Google Maps API; comment out starred (*) code blocks in this file
// * including these two lines if you want to hit the actual Google Maps API; https://jestjs.io/docs/en/mock-functions
jest.mock('../../initializeAjv/addLocationCustomKeyword/getGeocodingData')
const getGeocodingData = require('../../initializeAjv/addLocationCustomKeyword/getGeocodingData')

const {
  LOCATION_INPUT_1_dataAndSkippedRows,
  LOCATION_INPUT_1_sheetConfig,
} = require('./mockData/input1')

const { LOCATION_OUTPUT_1_sideEffectData } = require('./mockData/output1')

const {
  LOCATION_INPUT_2_dataAndSkippedRows,
  LOCATION_INPUT_2_sheetConfig,
} = require('./mockData/input2')

const { LOCATION_OUTPUT_2_sideEffectData } = require('./mockData/output2')

const {
  LOCATION_INPUT_3_dataAndSkippedRows,
  LOCATION_INPUT_3_sheetConfig,
} = require('./mockData/input3')

const {
  LOCATION_OUTPUT_3_sideEffectData,
  LOCATION_OUTPUT_3_errors,
  LOCATION_OUTPUT_3_formattedErrors,
} = require('./mockData/output3')

describe('Test location validation', () => {
  test(`- Data with valid location strings passes validation (sample of 9 docs)
    - Side-effect of generating geocoding data generates expected data`, async () => {
    // * mock API calls to Google Maps API
    LOCATION_OUTPUT_1_sideEffectData.reduce((acc, { data }) => {
      acc.mockImplementationOnce(() => data)
      return acc
    }, getGeocodingData)

    const { result, skippedRows } = LOCATION_INPUT_1_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
      sideEffectData,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: LOCATION_INPUT_1_sheetConfig,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(sideEffectData).toStrictEqual(LOCATION_OUTPUT_1_sideEffectData)
    expect(result).toStrictEqual(data) // data shouldn't be mutated
  })

  test(`Data with valid location strings passes validation (sample of 100 docs)`, async () => {
    // * mock API calls to Google Maps API
    LOCATION_OUTPUT_2_sideEffectData.reduce((acc, { data }) => {
      acc.mockImplementationOnce(() => data)
      return acc
    }, getGeocodingData)

    const { result, skippedRows } = LOCATION_INPUT_2_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
      sideEffectData,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: LOCATION_INPUT_2_sheetConfig,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(sideEffectData).toStrictEqual(LOCATION_OUTPUT_2_sideEffectData)
    expect(result).toStrictEqual(data) // data shouldn't be mutated
  })

  test(`Data with invalid location strings fail validation`, async () => {
    // * mock API calls to Google Maps API
    LOCATION_OUTPUT_3_sideEffectData.reduce((acc, { data }) => {
      acc.mockImplementationOnce(() => data)
      return acc
    }, getGeocodingData)

    const { result, skippedRows } = LOCATION_INPUT_3_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
      sideEffectData,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: LOCATION_INPUT_3_sheetConfig,
    })

    const formattedErrors = formatAjvErrors({
      errors,
      wb: 'Mock Workbook',
      sheet: 'Mock Sheet'
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(LOCATION_OUTPUT_3_errors)
    expect(formattedErrors).toStrictEqual(LOCATION_OUTPUT_3_formattedErrors)
    expect(sideEffectData).toStrictEqual(LOCATION_OUTPUT_3_sideEffectData)
    expect(result).toStrictEqual(data) // data shouldn't be mutated
  })
})
