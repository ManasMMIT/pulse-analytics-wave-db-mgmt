const Manager = require('../Manager')
const {
  mockTimestamp,
  mockOrganizations,
  mockEnrichedPtps,
} = require('./input.mocks')

const {
  mockOrgsHashBySlug,
  mockEnrichedPtpsByPtps,
} = require('./output.mocks')

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

  test('setEnrichedPtpsByCombos should return an array of ptps grouped by PTP', () => {
    const manager = new Manager({})
    manager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    expect(manager.enrichedPtpsByCombo).toStrictEqual(mockEnrichedPtpsByPtps)
  })

  // test('setEnrichedPtpsByCombos should return an array of ptps grouped by BRCS', () => {
  //   const manager = new Manager({ sheetData: [] })
  //   manager.setEnrichedPtpsByCombination([])
  //   expect(manager.enrichedPtpsByCombo).toBe(1)
  // })

  // test('setQualityOfAccessHash should return an array of quality of access data grouped by access', () => {
  //   const manager = new Manager({ sheetData: [] })
  //   manager.setQualityOfAccessHash([])
  //   expect(manager.qualityOfAccessHash).toBe(1)
  // })

  // test('getFilteredAndEnrichedSheetData should return ', () => {
  //   const manager = new Manager({ sheetData: [] })
  //   manager.setOrgsHashBySlug([])
  //   manager.setEnrichedPtpsByCombination([])
  //   manager.setQualityOfAccessHash([])

  // })
})
