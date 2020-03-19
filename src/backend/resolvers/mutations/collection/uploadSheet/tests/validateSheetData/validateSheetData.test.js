const validate = require('../../utils/validate')

const validProgramOverviewSanitizationRes = require('../sanitizeSheetData/mockData/output/sanitized-program-overview')
const mockSheetConfig = require('./mockData/input/program-overview-sheet-config')
const coercedProgramOverviewDataOutput = require('./mockData/output/coerced-valid-program-overview')

const invalidProgramOverviewSanitizationRes = require('./mockData/input/invalid-sanitized-program-overview')
const errorsForInvalidProgramOverview = require('./mockData/output/errors-for-invalid-program-overview')

test('Valid data is reported valid with zero errors and type-coerced values', () => {
  const { result, skippedRows } = validProgramOverviewSanitizationRes

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: mockSheetConfig, 
  })

  expect(valid).toEqual(true)
  expect(errors).toStrictEqual([])

  // - observe how values for "start" key weren't all strings before but they now are
  // - observe how values for "end" key that were null have been coerced into empty strings
  expect(data).toStrictEqual(coercedProgramOverviewDataOutput)
})

test('Invalid data is reported invalid with correct errors', () => {
  const { result, skippedRows } = invalidProgramOverviewSanitizationRes

  const {
    valid,
    errors,
    // data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: mockSheetConfig, 
  })

  expect(valid).toEqual(false)
  expect(errors).toStrictEqual(errorsForInvalidProgramOverview)
  
  // TODO: coercion doesn't work and isn't expected to for certain invalid values; test as such
})
