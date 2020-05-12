const Manager = require('../Manager')
const {
  mockTimestamp,
  mockOrganizations,
  mockEnrichedPtps,
  mockAccesses,
  mockSheetData,
} = require('./inputMockDatata')

const {
  mockOrgsHashBySlug,
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs,
  mockQualityOfAccessHash
} = require('./outputMockDatata')

describe('Sheet to Core Manager', () => {
  test('setTimezone method should set a NY time date object', () => {
    const manager = new Manager({})
    manager.setTimeZone(mockTimestamp)
    const expectedTimestamp = new Date('2020-04-30T04:00:00.000+00:00')
    expect(manager.timestamp).toStrictEqual(expectedTimestamp)
  })

  test('setOrgsHashBySlug should set an array of organizations keyed by slug', () => {
    const manager = new Manager({})
    manager.setOrgsHashBySlug(mockOrganizations)
    expect(manager.orgsHashBySlug).toStrictEqual(mockOrgsHashBySlug)
  })

  test('setEnrichedPtpsByCombos should set an array of ptps grouped by PTP', () => {
    const manager = new Manager({})
    manager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    expect(manager.enrichedPtpsByCombo).toStrictEqual(mockEnrichedPtpsByPtps)
  })

  test('setEnrichedPtpsByCombos should set an array of ptps grouped by BRCS if hashType is set as brcs', () => {
    const manager = new Manager({ hashType: 'brcs' })
    manager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    expect(manager.enrichedPtpsByCombo).toStrictEqual(mockEnrichedPtpsByBrcs)
  })

  test('setQualityOfAccessHash should set an array of quality of access data grouped by access', () => {
    const manager = new Manager({})
    manager.setQualityOfAccessHash(mockAccesses)
    expect(manager.qualityOfAccessHash).toStrictEqual(mockQualityOfAccessHash)
  })

  test('getFilteredAndEnrichedSheetData should return ', () => {
    const manager = new Manager({ sheetData: mockSheetData })
    manager.setOrgsHashBySlug(mockOrganizations)
    manager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    manager.setQualityOfAccessHash(mockAccesses)


  })
})
