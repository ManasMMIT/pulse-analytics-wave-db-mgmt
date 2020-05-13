const AdditionalCriteriaManager = require('../AdditionalCriteriaManager')
const {
  mockTimestamp,
  mockOrganizations,
  mockEnrichedPtps,
  mockAccesses,
  mockSheetData,
  mockProjectId,
} = require('./mocks/input/additionalCriteriaManagerMocks')

const {
  mockPermittedOps
} = require('./mocks/output/additionalCriteriaManagerMocks')

describe('Additional Criteria Manager', () => {
  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const additionalCriteriaManager = new AdditionalCriteriaManager({
      sheetData: mockSheetData,
      timestamp: mockTimestamp,
      mockProjectId
    })

    additionalCriteriaManager.setHashes({
      setOrgs: mockOrganizations,
      setEnrichedPtps: mockEnrichedPtps,
      setQualityOfAccesses: mockAccesses
    })

    const permittedOps = additionalCriteriaManager.getPermittedOps()

    expect(permittedOps).toStrictEqual(mockPermittedOps)
  })
})