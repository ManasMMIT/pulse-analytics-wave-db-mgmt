const mockRawData = require('./mockData/input/program-overview-raw-data')
const sanitizedProgramOverview = require('./mockData/output/sanitized-program-overview')
const sanitizeAndFormat = require('../utils/sanitizeAndFormat')

test('test sanitization', () => {
  const sanitizedData = sanitizeAndFormat(mockRawData)

  expect(sanitizedData).toStrictEqual(sanitizedProgramOverview)
})
