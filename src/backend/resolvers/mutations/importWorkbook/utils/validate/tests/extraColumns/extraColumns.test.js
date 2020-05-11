const validate = require('../..')

const {
  EXTRA_COLS_dataAndSkippedRows,
  EXTRA_COLS_sheetConfig,
} = require('./mockData/input')
const EXTRA_COLS_data = require('./mockData/output/data')

describe('Test removal of extra columns', () => {
  test("Extra columns (keys not in sheet config) are excluded from import", async () => {
    const { result, skippedRows } = EXTRA_COLS_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: EXTRA_COLS_sheetConfig,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(EXTRA_COLS_data)
  })
})
