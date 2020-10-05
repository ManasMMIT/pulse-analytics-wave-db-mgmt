const simpleDeltasOutput = [
  { field: 'A', before: 1, after: 2 },
  { field: 'B', before: 'a', after: 'b' },
  { field: 'C', before: 3, after: 4 },
]

const simpleFlatArrayDeltasOutput = [
  { field: 'A', before: '1, a, 3', after: '2, b, 4' },
]

const mixedFlatArrayDeltasOutput = [
  { field: 'B', before: 2, after: 'c' },
  ...simpleFlatArrayDeltasOutput,
]

const nestedFlatArrayDeltasOutput = [
  { field: 'A.B', before: '1, a, 3', after: '2, b, 4' },
]

const simpleInjectModalLabelOutput = [
  { field: 'Label A', before: 1, after: 2 },
  { field: 'Label B1', before: 'a', after: 'b' },
  { field: 'C', before: 3, after: 4 },
]

module.exports = {
  simpleDeltasOutput,
  simpleFlatArrayDeltasOutput,
  mixedFlatArrayDeltasOutput,
  nestedFlatArrayDeltasOutput,
  simpleInjectModalLabelOutput,
}
