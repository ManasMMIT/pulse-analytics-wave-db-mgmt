const {
  simpleDeltasInput,
  MOCK_BOID_ONE,
  MOCK_BOID_TWO,
  simpleFieldLabelMap,
  fieldLabelMapWithWidget,
  widgetDelta,
  connectedEntities,
} = require('./inputs')

const { simpleInjectModalLabelOutput } = require('./outputs')

const injectModalLabels = require('../injectModalLabels')

test('Replaces field names with business object modal labels', () => {
  const newDeltas = injectModalLabels({
    deltas: simpleDeltasInput,
    fieldLabelMaps: simpleFieldLabelMap,
    boId: MOCK_BOID_ONE,
  })

  expect(newDeltas).toEqual(simpleInjectModalLabelOutput)
})

test('Replaces dupe field names in respect to business objects', () => {
  const newDeltas = injectModalLabels({
    deltas: simpleDeltasInput,
    fieldLabelMaps: simpleFieldLabelMap,
    boId: MOCK_BOID_ONE,
  })

  const firstBoIdBLabel = simpleFieldLabelMap.basicModalMap[MOCK_BOID_ONE].B
  const secondBoIdBLabel = simpleFieldLabelMap.basicModalMap[MOCK_BOID_TWO].B

  const rightBoIdLabel = newDeltas.find(
    ({ field }) => field === firstBoIdBLabel
  )

  const wrongBoIdLabel = newDeltas.find(
    ({ field }) => field === secondBoIdBLabel
  )

  expect(rightBoIdLabel).toBeTruthy()
  expect(wrongBoIdLabel).toBeFalsy()
})

test('Replaces field names with business object modal WIDGET labels', () => {
  const newDeltas = injectModalLabels({
    deltas: [widgetDelta],
    fieldLabelMaps: fieldLabelMapWithWidget,
    connectedEntities,
  })

  const [{ boId: boId1 }, { boId: boId2 }] = connectedEntities

  const correctNewDeltaLabel =
    fieldLabelMapWithWidget.widgetModalMap[boId1][boId2].widget

  const isCorrectLabelSet = newDeltas.find(
    ({ field }) => field === correctNewDeltaLabel
  )

  expect(isCorrectLabelSet).toBeTruthy()
})

test('Keeps unmapped fields unchanged', () => {
  const newDeltas = injectModalLabels({
    deltas: simpleDeltasInput,
    fieldLabelMaps: simpleFieldLabelMap,
    boId: MOCK_BOID_ONE,
  })

  const inputFieldC = simpleDeltasInput.find(({ field }) => field === 'C').field
  const outputFieldC = newDeltas.find(({ field }) => field === 'C').field

  expect(inputFieldC).toBe(outputFieldC)
})
