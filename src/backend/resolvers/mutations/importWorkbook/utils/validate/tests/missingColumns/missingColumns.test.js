const validate = require('../..')
const formatAjvErrors = require('../../../formatAjvErrors')

const {
  MISSING_COLS_dataAndSkippedRows,
  MISSING_COLS_sheetConfig,
} = require('./mockData/input')
const {
  MISSING_COLS_data,
  MISSING_COLS_errors,
  MISSING_COLS_formattedErrors,
} = require('./mockData/output')

describe('Test erroring on missing columns', () => {
  test("Missing columns (keys in sheet config but not in data) fail validation", async () => {
    const { result, skippedRows } = MISSING_COLS_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: MISSING_COLS_sheetConfig,
    })

    const formattedErrors = formatAjvErrors({
      errors,
      wb: 'Mock Workbook',
      sheet: 'Mock Sheet'
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(MISSING_COLS_errors)
    expect(formattedErrors).toStrictEqual(MISSING_COLS_formattedErrors)
    expect(data).toStrictEqual(MISSING_COLS_data)
  })
})
