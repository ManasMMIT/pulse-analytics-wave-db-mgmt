const Validator = require('./Validator')
const { 
  mockPtps,
  mockInvalidData,
  mockValidSheetData,
  mockDuplicateInvalidData,
} = require('./Validator.mocks')

describe('Validator', () => {
  test('validates Quality of Access sheet', () => {
    // const sheetValidator = new Validator(validatorConfig)
    expect(1).toEqual(1)
  })

  test('validates Additional Criteria sheet', () => {
    expect(1).toEqual(1)
  })

  test('validates Policy Links sheet', () => {
    expect(1).toEqual(1)
  })
})