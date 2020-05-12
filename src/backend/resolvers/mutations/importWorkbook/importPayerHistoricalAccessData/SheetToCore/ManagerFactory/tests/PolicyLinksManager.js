const PolicyLinksManager = require('../PolicyLinksManager')
const {
  mockTimestamp,
  mockOrganizations,
  mockEnrichedPtps,
  mockAccesses,
  mockSheetData,
} = require('./mocks/input/managerMocks')

const {
  mockOrgsHashBySlug,
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs,
  mockQualityOfAccessHash,
  mockFilteredAndEnrichedData
} = require('./mocks/output/managerMocks')

describe('Quality of Access Manager', () => {
  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const qoaManager = new PolicyLinksManager({
      sheetData: mockSheetData,
      timestamp: mockTimestamp
    })

    qoaManager.setOrgsHashBySlug(mockOrganizations)
    qoaManager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    qoaManager.setQualityOfAccessHash(mockAccesses)

    expect().toStrictEqual()
  })
})