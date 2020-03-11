const mockRawData = require('./mockData/input/program-overview-raw-data')
const mockWorkbookConfig = require('./mockData/input/pathways-wb-config')
const validate = require('../utils/validate')

test('test validation', () => {
  const validationResult = validate(
    mockRawData,
    mockWorkbookConfig,
  )

  expect(validationResult).toStrictEqual(mockRawData)
})
