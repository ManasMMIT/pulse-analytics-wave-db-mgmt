const Validator = require('./Validator')
const { 
  mockPtps,
  mockInvalidData,
  mockValidSheetData,
  mockDuplicateInvalidData,
} = require('./Validator.mocks')

describe('Validator', () => {
  describe('Quality of Access Sheet Validator', () => {
    test('should throw an Error if data is invalid', async () => {
      const sheetConfig = {
        sheetData: mockInvalidData
      }
      const validator = new Validator(sheetConfig)
      await expect(validator.validateQualityOfAccess(mockPtps)).rejects.toThrow(true)
    })

    test('should return true if data is valid', async () => {
      const sheetConfig = {
        sheetData: mockValidSheetData
      }

      const validator = new Validator(sheetConfig)
      await expect(validator.validateQualityOfAccess(mockPtps)).resolves.toBe(true)
    })
   

  })
  // test('validates Additional Criteria sheet', () => {
  //   expect(1).toEqual(1)
  // })

  // test('validates Policy Links sheet', () => {
  //   expect(1).toEqual(1)
  // })
})