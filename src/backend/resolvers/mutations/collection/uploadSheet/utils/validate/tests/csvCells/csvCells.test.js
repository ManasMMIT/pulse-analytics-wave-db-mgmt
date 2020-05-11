const validate = require('../..')
const formatAjvErrors = require('../../../formatAjvErrors')
const _ = require('lodash')

const influencersSheetConfig = require('./mockData/input1/influencers-sheet-config')
const validSanitizedInfluencersRes = require('./mockData/input1/valid-sanitized-influencers')
const coercedValidInfluencers = require('./mockData/output1/coerced-valid-influencers')

const invalidSanitiziedInfluencersRes = require('./mockData/input2/invalid-sanitized-influencers')
const coercedInvalidInfluencers = require('./mockData/output2/coerced-invalid-influencers')
const errorsForInvalidInfluencers = require('./mockData/output2/errors-for-invalid-influencers')
const formattedErrorsForInvalidInfluencers = require('./mockData/output2/formatted-errors-for-invalid-influencers')

const mixedCsvCellsInput = require('./mockData/input3/mixed-csv-cells')
const sheetConfigWithCsvType = require('./mockData/input3/sheet-config-with-csv-type')
const mixedCsvCellsOutput = require('./mockData/output3/mixed-csv-cells')

const mixedCsvCellsWithOneOfInput = require('./mockData/input4/mixed-csv-cells-with-oneOf')
const sheetConfigWithBlankCsvOneOf = require('./mockData/input4/sheet-config-with-blank-csv-oneOf')
const mixedCsvCellsWithOneOfOutput = require('./mockData/output4/mixed-csv-cells-with-oneOf')

const blankCsvCellsWithOneOfInput = require('./mockData/input5/blank-csv-cells-with-oneOf')
const blankCsvCellsWithOneOfOutput = require('./mockData/output5/blank-csv-cells-with-oneOf')
const errorsForBlankCsvCellsWithOneOfOutput = require('./mockData/output5/errors-for-blank-csv-cells-with-oneOf')

const mixedCsvCellsWithWhitespaceInput = require('./mockData/input6/mixed-csv-cells-with-whitespace')
const sheetConfigWithOneOf = require('./mockData/input6/sheet-config-with-oneOf')
const mixedCsvCellsWithWhitespaceOutput = require('./mockData/output6/mixed-csv-cells-with-whitespace')

const coercedInvalidMultiWhitespacedDataOutput = require('./mockData/output7/coerced-invalid-multi-whitespaced-data')
const errorsForMultiWhiteSpacedCsvCell = require('./mockData/output7/errors-for-multi-whitespaced-csv-cell')

describe('Test CSV cells validation', () => {
  test('Data with valid CSV values passes validation', async () => {
    const { result, skippedRows } = validSanitizedInfluencersRes

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: influencersSheetConfig,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(coercedValidInfluencers)
  })

  test(`- Invalid CSV values trigger errors if they're not in oneOf
    - Input data still coerced from string to arr of strings
    - Formatted error message is intelligible to casual user`, async () => {
    const { result, skippedRows } = invalidSanitiziedInfluencersRes

    const {
      valid,
      errors,
      data,
    } = await validate({
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

  test('Blank CSV cells are coerced into empty arrays', async () => {
    const { result, skippedRows } = mixedCsvCellsInput

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithCsvType,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(mixedCsvCellsOutput)
  })

  test(`- Blank CSV cells pass oneOf validation if oneOf includes empty string
    - Blank CSV cells are coerced into empty arrays`, async () => {
    const { result, skippedRows } = mixedCsvCellsWithOneOfInput

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithBlankCsvOneOf,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(mixedCsvCellsWithOneOfOutput)
  })

  test(`- Blank CSV cells fail oneOf validation if oneOf doesn't include empty string
    (Let ajv coerce blank cell's value to arr with empty string to force failure)`, async () => {
    const { result, skippedRows } = blankCsvCellsWithOneOfInput

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: influencersSheetConfig,
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(errorsForBlankCsvCellsWithOneOfOutput)
    expect(data).toStrictEqual(blankCsvCellsWithOneOfOutput)
  })

  test('Random whitespace values in CSV cells are sanitized', async () => {
    const { result, skippedRows } = _.cloneDeep(mixedCsvCellsWithWhitespaceInput) // reused in later test

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithCsvType,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(mixedCsvCellsWithWhitespaceOutput)
  })

  test("CSV cells sanitized to empty still fail oneOf if oneOf doesn't include empty string", async () => {
    const { result, skippedRows } = _.cloneDeep(mixedCsvCellsWithWhitespaceInput)

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithOneOf,
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(errorsForMultiWhiteSpacedCsvCell)
    expect(data).toStrictEqual(coercedInvalidMultiWhitespacedDataOutput)
  })
})
