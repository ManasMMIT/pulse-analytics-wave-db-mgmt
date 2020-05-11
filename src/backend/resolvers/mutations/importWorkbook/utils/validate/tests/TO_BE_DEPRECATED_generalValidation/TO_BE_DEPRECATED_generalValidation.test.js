const validate = require('../..')

const validProgramOverviewSanitizationRes = require('./mockData/input1/sanitized-program-overview')
const programOverviewSheetConfig = require('./mockData/input1/program-overview-sheet-config')
const coercedProgramOverviewDataOutput = require('./mockData/output1/coerced-valid-program-overview')

const invalidProgramOverviewSanitizationRes = require('./mockData/input2/invalid-sanitized-program-overview')
const errorsForInvalidProgramOverview = require('./mockData/output2/errors-for-invalid-program-overview')

describe('TO_BE_DEPRECATED: Test general validation and type coercion', () => {
  test('Valid data is reported valid with zero errors and type-coerced values', async () => {
    const { result, skippedRows } = validProgramOverviewSanitizationRes

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: programOverviewSheetConfig,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])

    // - observe how values for "start" key weren't all strings before but they now are
    expect(data).toStrictEqual(coercedProgramOverviewDataOutput)
  })

  test('Invalid data is reported invalid with correct errors', async () => {
    const { result, skippedRows } = invalidProgramOverviewSanitizationRes

    const {
      valid,
      errors,
      // data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: programOverviewSheetConfig,
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(errorsForInvalidProgramOverview)

    // TODO: witness here that coercion isn't expected to work going from a certain type to type; test accordingly
  })
})
