const validate = require('../..')
const _ = require('lodash')

const influencersSheetConfig = require('./mockData/input/influencers-sheet-config')

const mixedRegularCellsInput = require('./mockData/input/mixed-regular-cells')
const sheetConfigWithStringType = require('./mockData/input/sheet-config-with-string-type')

const mixedRegularCellsWithOneOfInput = require('./mockData/input/mixed-regular-cells-with-oneOf')
const sheetConfigWithBlankOneOf = require('./mockData/input/sheet-config-with-blank-oneOf')

const blankRegularCellsWithOneOfInput = require('./mockData/input/blank-regular-cells-with-oneOf')
const blankRegularCellsWithOneOfOutput = require('./mockData/output/blank-regular-cells-with-oneOf')
const errorsForBlankRegularCellsWithOneOfOutput = require('./mockData/output/errors-for-blank-regular-cells-with-oneOf')

describe('Test blank non-CSV cells validation', () => {
  test('Blank non-CSV cells are left alone to be persisted as null', async () => {
    const { result, skippedRows } = mixedRegularCellsInput
    const copyInputData = _.cloneDeep(result)

    const {
      valid,
      errors,
      data,
    } = await validate({
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
    - Blank non-CSV cell's value is left as null`, async () => {
    const { result, skippedRows } = mixedRegularCellsWithOneOfInput
    const copyInputData = _.cloneDeep(result)

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithBlankOneOf,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(copyInputData)
  })

  test(`- Blank non-CSV cells fail oneOf validation if oneOf doesn't include empty string
    - Blank non-CSV cell's value is left as null`, async () => {
    const { result, skippedRows } = blankRegularCellsWithOneOfInput

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
    expect(errors).toStrictEqual(errorsForBlankRegularCellsWithOneOfOutput)
    expect(data).toStrictEqual(blankRegularCellsWithOneOfOutput)
  })
})
