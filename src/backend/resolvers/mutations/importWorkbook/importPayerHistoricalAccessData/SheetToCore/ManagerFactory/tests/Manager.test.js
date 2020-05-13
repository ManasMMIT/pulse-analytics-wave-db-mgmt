const Manager = require('../Manager')
const {
  mockTimestamp,
  mockEnrichedPtps,
  mockSheetData,
} = require('./mocks/input/managerMocks')

const {
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs,
  mockFilteredAndEnrichedData,
  mockFormattedTimestamp
} = require('./mocks/output/managerMocks')

describe('Sheet to Core Manager', () => {
  test('setTimezone method should set a NY time date object', () => {
    const manager = new Manager({})
    manager.setTimeZone(mockTimestamp)
    expect(manager.timestamp).toStrictEqual(mockFormattedTimestamp)
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

  test('getFilteredAndEnrichedSheetData should return enriched sheet data ', () => {
    const manager = new Manager({ sheetData: mockSheetData })
    manager.setEnrichedPtpsByCombination(mockEnrichedPtps)

    const filteredAndEnrichedSheetData = manager.getFilteredAndEnrichedSheetData()
    expect(filteredAndEnrichedSheetData).toStrictEqual(mockFilteredAndEnrichedData)
  })
})
