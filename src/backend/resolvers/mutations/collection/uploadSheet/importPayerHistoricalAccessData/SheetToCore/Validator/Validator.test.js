const Validator = require('./Validator')
const { 
  mockPtps,
  mockBrcs,
  mockInvalidQoaData,
  mockValidQoaData,
  mockDuplicateInvalidQoaData,
  mockValidCriteriaData,
  mockInvalidCriteriaData,
  mockValidPolicyLinkData,
  mockInvalidPolicyLinkData,
  mockDuplicateInvalidPolicyLinkData
} = require('./Validator.mocks')

describe('Validator', () => {
  describe('Quality of Access Sheet Validator', () => {
    test('should throw an Error if sheet data is invalid', async () => {
      const sheetConfig = { sheetData: mockInvalidQoaData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validateQualityOfAccess(mockPtps)).rejects.toThrow()
    })

    test('should throw an Error if sheet data is valid but has duplicate combos', async () => {
      const sheetConfig = { sheetData: mockDuplicateInvalidQoaData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validateQualityOfAccess(mockPtps)).rejects.toThrow()
    })

    test('should return true if data is valid', async () => {
      const sheetConfig = {
        sheetData: mockValidQoaData
      }
      const validator = new Validator(sheetConfig)
      await expect(validator.validateQualityOfAccess(mockPtps)).resolves.toBe(true)
    })
  })

  describe('Additional Criteria Validator', () => {
    test('should throw an Error if sheet data is invalid', async () => {
      const sheetConfig = { sheetData: mockInvalidCriteriaData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validateAdditionalCriteria(mockPtps)).rejects.toThrow()
    })

    test('should return true if data is valid', async () => {
      const sheetConfig = { sheetData: mockValidCriteriaData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validateAdditionalCriteria(mockPtps)).resolves.toBe(true)
    })
  })

  describe('Policy Link Validator', () => {
    test('should throw an Error if sheet data is invalid', async () => {
      const sheetConfig = { sheetData: mockInvalidPolicyLinkData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validatePolicyLinks(mockBrcs)).rejects.toThrow()
    })

    test('should throw an Error if sheet data has duplicate combos', async () => {
      const sheetConfig = { sheetData: mockDuplicateInvalidPolicyLinkData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validatePolicyLinks(mockBrcs)).rejects.toThrow()
    })

    test('should return true if data is valid', async () => {
      const sheetConfig = { sheetData: mockValidPolicyLinkData }
      const validator = new Validator(sheetConfig)
      await expect(validator.validatePolicyLinks(mockBrcs)).resolves.toBe(true)
    })
  })
})