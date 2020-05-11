const validateQualityOfAccess = require('./validateQualityOfAccess')
const validateAdditionalCriteria = require('./validateAdditionalCriteria')
const validatePolicyLinks = require('./validatePolicyLinks')

const {
  mockPtps,
  mockBrcs,
  mockInvalidQoaData,
  mockInvalidQoaData2,
  mockValidQoaData,
  mockDuplicateInvalidQoaData,
  mockValidCriteriaData,
  mockInvalidCriteriaData,
  mockValidPolicyLinkData,
  mockValidPolicyLinkData2,
  mockInvalidPolicyLinkData,
  mockDuplicateInvalidPolicyLinkData
} = require('./mockData')

describe('Validate payer historical access data', () => {
  describe('Validate Quality of Access Sheet', () => {
    test('should throw an Error if sheet data contains invalid combinations', () => {
      const validatorConfig = {
        sheetData: mockInvalidQoaData,
        strictlyRequiredPtps: mockPtps
      }
      expect(() => validateQualityOfAccess(validatorConfig)).toThrow()
    })
    test('should throw an Error if sheet data is a subset of the allowed combinations', () => {
      const validatorConfig = {
        sheetData: mockInvalidQoaData2,
        strictlyRequiredPtps: mockPtps
      }
      expect(() => validateQualityOfAccess(validatorConfig)).toThrow()
    })
    
    test('should throw an Error if sheet data is valid but has duplicate combos', () => {
      const validatorConfig = {
        sheetData: mockDuplicateInvalidQoaData,
        strictlyRequiredPtps: mockPtps
      }
      expect(() => validateQualityOfAccess(validatorConfig)).toThrow()
    })

    test('should return true if data is valid', () => {
      const validatorConfig = {
        sheetData: mockValidQoaData,
        strictlyRequiredPtps: mockPtps
      }
      expect(validateQualityOfAccess(validatorConfig)).toBe(true)
    })
  })

  describe('Validate Additional Criteria', () => {
    test('should throw an Error if sheet data is invalid', () => {
      const validatorConfig = {
        sheetData: mockInvalidCriteriaData,
        allowedPtps: mockPtps
      }
      expect(() => validateAdditionalCriteria(validatorConfig)).toThrow()
    })

    test('should return true if data is valid', () => {
      const validatorConfig = {
        sheetData: mockValidCriteriaData,
        allowedPtps: mockPtps
      }
      expect(validateAdditionalCriteria(validatorConfig)).toBe(true)
    })
  })

  describe('Validate Policy Link', () => {
    test('should throw an Error if sheet data is invalid', () => {
      const validatorConfig = {
        sheetData: mockInvalidPolicyLinkData,
        allowedBrcs: mockBrcs
      }
      expect(() => validatePolicyLinks(validatorConfig)).toThrow()
    })

    test('should throw an Error if sheet data has duplicate combos', () => {
      const validatorConfig = {
        sheetData: mockDuplicateInvalidPolicyLinkData,
        allowedBrcs: mockBrcs
      }
      expect(() => validatePolicyLinks(validatorConfig)).toThrow()
    })

    test('should return true if sheet data brcs combination is valid', () => {
      const validatorConfig = {
        sheetData: mockValidPolicyLinkData,
        allowedBrcs: mockBrcs
      }
      expect(validatePolicyLinks(validatorConfig)).toBe(true)
    })

    test(
      'should return true even if sheet data brcs combination is a subset of the allowed combinations',
      () => {
        const validatorConfig = {
          sheetData: mockValidPolicyLinkData2,
          allowedBrcs: mockBrcs
        }
        expect(validatePolicyLinks(validatorConfig)).toBe(true)
      }
    )
  })
})
