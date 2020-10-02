const simpleDeltasInput = [
  { field: 'A', before: 1, after: 2 },
  { field: 'B', before: 'a', after: 'b' },
  { field: 'C', before: 3, after: 4 },
]

const simpleFlatArrayDeltasInput = [
  { field: 'A.0', before: 1, after: 2 },
  { field: 'A.1', before: 'a', after: 'b' },
  { field: 'A.2', before: 3, after: 4 },
]

const mixedSimpleFlatArrayDeltasInput = [
  ...simpleFlatArrayDeltasInput,
  { field: 'B', before: 2, after: 'c' },
]

const nestedFlatArrayDeltasInput = [
  { field: 'A.B.0', before: 1, after: 2 },
  { field: 'A.B.1', before: 'a', after: 'b' },
  { field: 'A.B.2', before: 3, after: 4 },
]

const MOCK_BOID_ONE = '123'
const MOCK_BOID_TWO = '456'

const connectedEntities = [{ boId: 'abc' }, { boId: 'def' }]

const simpleFieldLabelMap = {
  [MOCK_BOID_ONE]: {
    A: 'Label A',
    B: 'Label B1',
  },
  [MOCK_BOID_TWO]: {
    B: 'Label B2',
  },
}

const fieldLabelMapWithWidget = {
  ...simpleFieldLabelMap,
  [connectedEntities[0].boId]: {
    [connectedEntities[1].boId]: {
      widget: 'Widget Label',
    },
  },
}

const widgetDelta = {
  field: 'widget',
  before: 1,
  after: 2,
}

module.exports = {
  simpleDeltasInput,
  simpleFlatArrayDeltasInput,
  mixedSimpleFlatArrayDeltasInput,
  nestedFlatArrayDeltasInput,
  MOCK_BOID_ONE,
  MOCK_BOID_TWO,
  simpleFieldLabelMap,
  fieldLabelMapWithWidget,
  widgetDelta,
  connectedEntities,
}
