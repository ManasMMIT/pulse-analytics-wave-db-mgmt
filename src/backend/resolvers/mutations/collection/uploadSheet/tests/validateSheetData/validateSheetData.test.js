const sanitizedProgramOverviewData = require('../sanitizeSheetData/mockData/output/sanitized-program-overview')
const mockSheetConfig = require('./mockData/input/program-overview-sheet-config')
const validate = require('../../utils/validate')

test('test validation', () => {
  const validationResult = validate(
    sanitizedProgramOverviewData,
    mockSheetConfig,
  )

  expect(validationResult).toStrictEqual(sanitizedProgramOverviewData)
})
