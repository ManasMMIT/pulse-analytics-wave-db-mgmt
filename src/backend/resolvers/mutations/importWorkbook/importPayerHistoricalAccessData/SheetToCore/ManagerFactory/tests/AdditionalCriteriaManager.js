const AdditionalCriteriaManager = require('../AdditionalCriteriaManager')
const {
  mockTimestamp,
  mockOrganizations,
  mockEnrichedPtps,
  mockAccesses,
  mockSheetData,
  mockProjectId,
} = require('./mocks/inputMockDatackData')

const {
  mockPermittedOps
} = require('./mocks/outputMockDatackData')

describe('Quality of Access Manager', () => {
  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const qoaManager = new AdditionalCriteriaManager({
      sheetData: mockSheetData,
      timestamp: mockTimestamp,
      mockProjectId
    })

    qoaManager.setHashes({
      setOrgs: mockOrganizations,
      setEnrichedPtps: mockEnrichedPtps,
      setQualityOfAccesses: mockAccesses
    })

    const permittedOps = qoaManager.getPermittedOps()

    expect(permittedOps).toStrictEqual(mockPermittedOps)
  })
})