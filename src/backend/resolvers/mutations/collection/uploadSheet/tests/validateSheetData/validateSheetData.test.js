const validate = require('../../utils/validate')
const formatAjvErrors = require('../../utils/formatAjvErrors')
const _ = require('lodash')

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

const mixedRegularCellsInput = require('./mockData/input/mixed-regular-cells')
const sheetConfigWithStringType = require('./mockData/input/sheet-config-with-string-type')

const mixedRegularCellsWithOneOfInput = require('./mockData/input/mixed-regular-cells-with-oneOf')
const sheetConfigWithBlankOneOf = require('./mockData/input/sheet-config-with-blank-oneOf')

const blankRegularCellsWithOneOfInput = require('./mockData/input/blank-regular-cells-with-oneOf')
const blankRegularCellsWithOneOfOutput = require('./mockData/output/blank-regular-cells-with-oneOf')
const errorsForBlankRegularCellsWithOneOfOutput = require('./mockData/output/errors-for-blank-regular-cells-with-oneOf')

const mixedCsvCellsInput = require('./mockData/input/mixed-csv-cells')
const sheetConfigWithCsvType = require('./mockData/input/sheet-config-with-csv-type')
const mixedCsvCellsOutput = require('./mockData/output/mixed-csv-cells')

const mixedCsvCellsWithOneOfInput = require('./mockData/input/mixed-csv-cells-with-oneOf')
const sheetConfigWithBlankCsvOneOf = require('./mockData/input/sheet-config-with-blank-csv-oneOf')
const mixedCsvCellsWithOneOfOutput = require('./mockData/output/mixed-csv-cells-with-oneOf')

const blankCsvCellsWithOneOfInput = require('./mockData/input/blank-csv-cells-with-oneOf')
const blankCsvCellsWithOneOfOutput = require('./mockData/output/blank-csv-cells-with-oneOf')
const errorsForBlankCsvCellsWithOneOfOutput = require('./mockData/output/errors-for-blank-csv-cells-with-oneOf')

const mixedCsvCellsWithWhitespaceInput = require('./mockData/input/mixed-csv-cells-with-whitespace')
const sheetConfigWithOneOf = require('./mockData/input/sheet-config-with-oneOf')
const mixedCsvCellsWithWhitespaceOutput = require('./mockData/output/mixed-csv-cells-with-whitespace')

const coercedInvalidMultiWhitespacedDataOutput = require('./mockData/output/coerced-invalid-multi-whitespaced-data')
const errorsForMultiWhiteSpacedCsvCell = require('./mockData/output/errors-for-multi-whitespaced-csv-cell')

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
  
  // TODO: witness here that coercion isn't expected to work going from a certain type to type; test accordingly
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

// !!! ALL TESTS ABOVE THIS LINE ARE LIKELY TOO VAGUE TO BE THAT MEANINGFUL

test('Blank non-CSV cells are left alone to be persisted as null', () => {
  const { result, skippedRows } = mixedRegularCellsInput
  const copyInputData = _.cloneDeep(result)
  
  const {
    valid,
    errors,
    data,
  } = validate({
    data: result,
    skippedRows,
    sheetConfig: sheetConfigWithStringType,
  })

  expect(valid).toEqual(true)
  expect(errors).toStrictEqual([])
  expect(data).toStrictEqual(copyInputData)
})

test(`- Blank non-CSV cells pass oneOf validation if oneOf includes empty string
    - Empty string in oneOf is converted to null to line up with blank cells' values
    - Blank non-CSV cell's value is left as null`,
  () => {
    const { result, skippedRows } = mixedRegularCellsWithOneOfInput
    const copyInputData = _.cloneDeep(result)

    const {
      valid,
      errors,
      data,
    } = validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithBlankOneOf,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(copyInputData)
  })

test(`- Blank non-CSV cells fail oneOf validation if oneOf doesn't include empty string
    - Blank non-CSV cell's value is left as null`,
() => {
  const { result, skippedRows } = blankRegularCellsWithOneOfInput

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
  expect(errors).toStrictEqual(errorsForBlankRegularCellsWithOneOfOutput)
  expect(data).toStrictEqual(blankRegularCellsWithOneOfOutput)
})

test('Blank CSV cells are coerced into empty arrays', () => {
  const { result, skippedRows } = mixedCsvCellsInput
  
  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: sheetConfigWithCsvType, 
  })

  expect(valid).toEqual(true)
  expect(errors).toStrictEqual([])
  expect(data).toStrictEqual(mixedCsvCellsOutput)
})

test(`- Blank CSV cells pass oneOf validation if oneOf includes empty string
    - Blank CSV cells are coerced into empty arrays`,
() => {
  const { result, skippedRows } = mixedCsvCellsWithOneOfInput

  const {
    valid,
    errors,
    data,
  } = validate({ 
    data: result, 
    skippedRows, 
    sheetConfig: sheetConfigWithBlankCsvOneOf, 
  })

  expect(valid).toEqual(true)
  expect(errors).toStrictEqual([])
  expect(data).toStrictEqual(mixedCsvCellsWithOneOfOutput)
})

test(`- Blank CSV cells fail oneOf validation if oneOf doesn't include empty string
    (Let ajv coerce blank cell's value to arr with empty string to force failure)`,
() => {
  const { result, skippedRows } = blankCsvCellsWithOneOfInput

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
  expect(errors).toStrictEqual(errorsForBlankCsvCellsWithOneOfOutput)
  expect(data).toStrictEqual(blankCsvCellsWithOneOfOutput)
})

test('Random whitespace values in CSV cells are sanitized', () => {
  const { result, skippedRows } = _.cloneDeep(mixedCsvCellsWithWhitespaceInput) // reused in later test

  const {
    valid,
    errors,
    data,
  } = validate({
    data: result,
    skippedRows,
    sheetConfig: sheetConfigWithCsvType,
  })

  expect(valid).toEqual(true)
  expect(errors).toStrictEqual([])
  expect(data).toStrictEqual(mixedCsvCellsWithWhitespaceOutput)
})

test("CSV cells sanitized to empty still fail oneOf if oneOf doesn't include empty string", () => {
  const { result, skippedRows } = _.cloneDeep(mixedCsvCellsWithWhitespaceInput)

  const {
    valid,
    errors,
    data,
  } = validate({
    data: result,
    skippedRows,
    sheetConfig: sheetConfigWithOneOf,
  })

  expect(valid).toEqual(false)
  expect(errors).toStrictEqual(errorsForMultiWhiteSpacedCsvCell)
  expect(data).toStrictEqual(coercedInvalidMultiWhitespacedDataOutput)
})
