const validate = require('../..')

const {
  BO_INPUT_1_dataAndSkippedRows,
  BO_INPUT_1_mockDb,
  BO_INPUT_1_sheetConfig,
} = require('./mockData/input1')
const BO_OUTPUT_1_data = require('./mockData/output1')

const BO_INPUT_2_dataAndSkippedRows = require('./mockData/input2')
const {
  BO_OUTPUT_2_data,
  BO_OUTPUT_2_errors,
} = require('./mockData/output2')

const {
  BO_INPUT_3_dataAndSkippedRows,
  BO_INPUT_3_sheetConfig,
} = require('./mockData/input3')
const BO_OUTPUT_3_data = require('./mockData/output3')

const BO_OUTPUT_4_errors = require('./mockData/output4')

describe('Test business object validation', () => {
  test(`- Valid data with business object validation passes validation
    - oneOf disregarded when businessObj ref exists`, async () => {
    const { result, skippedRows } = BO_INPUT_1_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: BO_INPUT_1_sheetConfig,
      db: BO_INPUT_1_mockDb,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(BO_OUTPUT_1_data)
  })

  test(`- Invalid data with business object validation fails validation
    - oneOf disregarded when businessObj ref exists`, async () => {
    const { result, skippedRows } = BO_INPUT_2_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: BO_INPUT_1_sheetConfig,
      db: BO_INPUT_1_mockDb,
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(BO_OUTPUT_2_errors)
    expect(data).toStrictEqual(BO_OUTPUT_2_data)
  })

  test(`Data with blank cells pass when businessObjRef.allowBlankValues is true`, async () => {
    const { result, skippedRows } = BO_INPUT_3_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: BO_INPUT_3_sheetConfig,
      db: BO_INPUT_1_mockDb,
    })

    expect(valid).toEqual(true)
    expect(errors).toStrictEqual([])
    expect(data).toStrictEqual(BO_OUTPUT_3_data)
  })

  test(`Data with blank cells fail when businessObjRef.allowBlankValues is false`, async () => {
    const { result, skippedRows } = BO_INPUT_3_dataAndSkippedRows

    const {
      valid,
      errors,
      data,
    } = await validate({
      data: result,
      skippedRows,
      sheetConfig: BO_INPUT_1_sheetConfig,
      db: BO_INPUT_1_mockDb,
    })

    expect(valid).toEqual(false)
    expect(errors).toStrictEqual(BO_OUTPUT_4_errors)
    expect(data).toStrictEqual(BO_OUTPUT_3_data)
  })
})
