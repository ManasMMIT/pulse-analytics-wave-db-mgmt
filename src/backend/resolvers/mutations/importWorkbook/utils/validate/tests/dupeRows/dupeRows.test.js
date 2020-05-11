const validate = require('../..')
const formatAjvErrors = require('../../../formatAjvErrors')

const {
  DUPE_ROWS_dataAndSkippedRows,
  DUPE_ROWS_sheetConfig,
} = require('./mockData/input')

const {
  DUPE_ROWS_errors,
  DUPE_ROWS_formattedErrors,
} = require('./mockData/output')

describe('Test dupe rows validation', () => {
  test(`- Data coming in with dupe rows fails validation
    - Dupes are consolidated to error once for each set of dupes
    - Dupe row erroring precludes further error messaging`, async () => {
    const { result, skippedRows } = DUPE_ROWS_dataAndSkippedRows

    const {
      valid,
      errors,
      // data, // data will be undefined because dupe erroring means no data is returned
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: DUPE_ROWS_sheetConfig,
    })

    const formattedErrors = formatAjvErrors({
      errors,
      wb: 'Mock Workbook',
      sheet: 'Mock Sheet'
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(DUPE_ROWS_errors)
    expect(formattedErrors).toStrictEqual(DUPE_ROWS_formattedErrors)
  })
})
