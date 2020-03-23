const validate = require('../../utils/validate')

const validProgramOverviewSanitizationRes = require('../sanitizeSheetData/mockData/output/sanitized-program-overview')
const programOverviewSheetConfig = require('./mockData/input/program-overview-sheet-config')
const coercedProgramOverviewDataOutput = require('./mockData/output/coerced-valid-program-overview')

const invalidProgramOverviewSanitizationRes = require('./mockData/input/invalid-sanitized-program-overview')
const errorsForInvalidProgramOverview = require('./mockData/output/errors-for-invalid-program-overview')

const influencersSheetConfig = require('./mockData/input/influencers-sheet-config')
const invalidSanitiziedInfluencersRes = require('./mockData/input/invalid-sanitized-influencers')
const coercedInvalidInfluencers = require('./mockData/output/coerced-invalid-influencers')
const errorsForInvalidInfluencers  = require('./mockData/output/errors-for-invalid-influencers')
const formattedErrorsForInvalidInfluencers  = require('./mockData/output/formatted-errors-for-invalid-influencers')

const validSanitizedInfluencersRes = require('./mockData/input/valid-sanitized-influencers')
const coercedValidInfluencers = require('./mockData/output/coerced-valid-influencers')

const blankCsvCellsInput = require('./mockData/input/blank-csv-cells-with-oneOf')
const blankCsvCellsOutput = require('./mockData/output/blank-csv-cells-with-oneOf')
const errorsForBlankCsvCellsOutput = require('./mockData/output/errors-for-blank-csv-cells-with-oneOf')

const blankRegularCellsInput = require('./mockData/input/blank-regular-cells-with-oneOf')
const blankRegularCellsOutput = require('./mockData/output/blank-regular-cells-with-oneOf')
const errorsForBlankRegularCellsOutput = require('./mockData/output/errors-for-blank-regular-cells-with-oneOf')

const formatAjvErrors = require('../../utils/formatAjvErrors')

test('Valid data is reported valid with zero errors and type-coerced values', () => {
  const { result, skippedRows } = validProgramOverviewSanitizationRes

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: programOverviewSheetConfig, 
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
    sheetConfig: programOverviewSheetConfig, 
  })

  expect(valid).toEqual(false)
  expect(errors).toStrictEqual(errorsForInvalidProgramOverview)
  
  // TODO: coercion doesn't work and isn't expected to for certain invalid values; test as such
})

test(`- Invalid CSV values trigger errors if they're not in oneOf
    - Input data still coerced from string to arr of strings
    - Formatted error message is intelligible to casual user`, 
() => {
  const { result, skippedRows } = invalidSanitiziedInfluencersRes

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: influencersSheetConfig, 
  })

  const formattedErrors = formatAjvErrors({ 
    errors, 
    wb: 'Pathways-pristine-MASTER', 
    sheet: 'Influencers' 
  })

  expect(valid).toEqual(false)
  expect(errors).toStrictEqual(errorsForInvalidInfluencers)
  expect(formattedErrors).toStrictEqual(formattedErrorsForInvalidInfluencers)
  expect(data).toStrictEqual(coercedInvalidInfluencers)
})

test('Data with valid CSV values passes validation', () => {
  const { result, skippedRows } = validSanitizedInfluencersRes

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: influencersSheetConfig, 
  })

  expect(valid).toEqual(true)
  expect(errors).toStrictEqual([])
  expect(data).toStrictEqual(coercedValidInfluencers)
})

test(`- Blank CSV cells fail oneOf validation if oneOf doesn't include empty string
    - Blank CSV cell's value is coerced to arr with single empty string`,
() => {
  const { result, skippedRows } = blankCsvCellsInput

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: influencersSheetConfig, 
  })

  expect(valid).toEqual(false)
  expect(errors).toStrictEqual(errorsForBlankCsvCellsOutput)
  expect(data).toStrictEqual(blankCsvCellsOutput)
})

test(`- Blank non-CSV cells fail oneOf validation if oneOf doesn't include empty string
    - Blank non-CSV cell's value is coerced to empty string`,
() => {
  const { result, skippedRows } = blankRegularCellsInput

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: influencersSheetConfig, 
  })

  expect(valid).toEqual(false)
  expect(errors).toStrictEqual(errorsForBlankRegularCellsOutput)
  expect(data).toStrictEqual(blankRegularCellsOutput)
})
