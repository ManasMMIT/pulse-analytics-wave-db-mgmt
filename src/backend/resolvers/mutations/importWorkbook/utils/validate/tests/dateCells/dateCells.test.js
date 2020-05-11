const validate = require('../..')

const sheetConfigWithDateType = require('./mockData/input1/sheet-config-with-date-type')
const validDateStringsInput = require('./mockData/input1/valid-date-strings')
const validDateStringsOutput = require('./mockData/output1/valid-date-strings')

const invalidDateStringsInput = require('./mockData/input2/invalid-date-strings')
const invalidDateStringsOutput = require('./mockData/output2/invalid-date-strings')
const errorsForInvalidDateStrings = require('./mockData/output2/errors-for-invalid-date-strings')

describe('Test date cells validation', () => {
  test(`- Valid date cells pass validation and are coerced into Date objects
    - Valid date cell means null OR string formatted in short ISO, long ISO, d/M/yy, or dd/MM/yyyy format
    - If string, it's coerced into short ISO string (any time portion is stripped), then coerced into a Date object
    - Date object is generated with the UTC time equivalent to the NY-timezoned short ISO string`, async () => {
    const { result, skippedRows } = validDateStringsInput

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithDateType,
    })

    const formattedData = data.map(({ timestamp }) => {
      if (timestamp) return { timestamp: timestamp.getTime() }
      return { timestamp: null }
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(formattedData).toStrictEqual(validDateStringsOutput)
  })

  test("Invalid date cells fail validation", async () => {
    const { result, skippedRows } = invalidDateStringsInput

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: sheetConfigWithDateType,
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(errorsForInvalidDateStrings)
    expect(data).toStrictEqual(invalidDateStringsOutput)
  })
})
