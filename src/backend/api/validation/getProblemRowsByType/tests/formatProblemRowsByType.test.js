const formatProblemRowsByType = require('../formatProblemRowsByType')

const validFieldsByType = require('./inputs/validFieldsByType')
const sheetData = require('./inputs/sheetData')

const formattedProblemRowsByType = require('./outputs/formattedProblemRowsByType')

test('uses valid field values to generate problem rows', () => {
  const formattedResult = formatProblemRowsByType(validFieldsByType, sheetData)

  expect(formattedResult).toEqual(formattedProblemRowsByType)
})
