const {
  simpleDeltasInput,
  simpleFlatArrayDeltasInput,
  nestedFlatArrayDeltasInput,
} = require('./inputs')

const {
  simpleDeltasOutput,
  simpleFlatArrayDeltasOutput,
  nestedFlatArrayDeltasOutput,
} = require('./outputs')

const convertArrayDeltasToCsv = require('../convertArrayDeltasToCsv')

describe('Converts', () => {
  test('simple, flat array deltas to csv', () => {
    const output = convertArrayDeltasToCsv(simpleFlatArrayDeltasInput)

    expect(output).toEqual(simpleFlatArrayDeltasOutput)
  })

  test('nested array deltas to csv', () => {
    const output = convertArrayDeltasToCsv(nestedFlatArrayDeltasInput)

    expect(output).toEqual(nestedFlatArrayDeltasOutput)
  })
})

describe('Ignores', () => {
  test('non-array deltas', () => {
    const output = convertArrayDeltasToCsv(simpleDeltasInput)

    expect(output).toEqual(simpleDeltasOutput)
  })
})
