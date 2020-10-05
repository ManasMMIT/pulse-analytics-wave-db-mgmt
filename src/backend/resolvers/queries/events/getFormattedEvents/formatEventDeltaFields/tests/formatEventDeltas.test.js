const { simpleDeltasInput, simpleFlatArrayDeltasInput } = require('./inputs')

const { simpleDeltasOutput, simpleFlatArrayDeltasOutput } = require('./outputs')

const formatEventDeltas = require('../formatEventDeltas')

test('Converts flat array field delta values to csv', () => {
  const output = formatEventDeltas({
    deltas: simpleFlatArrayDeltasInput,
  })

  expect(output).toEqual(simpleFlatArrayDeltasOutput)
})
