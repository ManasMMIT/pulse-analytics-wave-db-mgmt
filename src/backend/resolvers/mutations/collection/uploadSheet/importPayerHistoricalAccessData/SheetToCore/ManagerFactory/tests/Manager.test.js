const Manager = require('../Manager')
const {
  mockTimestamp
} = require('./mockData')

describe('Sheet to Core Manager', () => {
  const manager = new Manager({
    sheetData: []
  })

  test('setTimezone should return new york time', () => {
    manager.setTimeZone(mockTimestamp)
    const expectedTimestamp = new Date('2020-04-30T04:00:00.000+00:00')
    expect(manager.timestamp).toStrictEqual(expectedTimestamp)
  })

})
