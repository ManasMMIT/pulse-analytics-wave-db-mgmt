const getResourcesDiff = require('../getResourcesDiff')
const prevResources = require('./mocks/input/prev-resources')
const nextResources = require('./mocks/input/next-resources')
const resourcesDiff = require('./mocks/output/resourcesDiff')

const result = getResourcesDiff({
  prevResources,
  nextResources,
})

test('diffs accounts and treatment plans correctly', () => {
  expect(result).toStrictEqual(resourcesDiff)
})
