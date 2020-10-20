const _ = require('lodash')

const PLACEHOLDER_VALUE = require('./placeholder-value')

const convertArrayDeltasToCsv = require('./convertArrayDeltasToCsv')
const injectModalLabels = require('./injectModalLabels')

const INVALID_VALUES = ['', null, undefined]
const convertDeltasToStringsOrNone = (deltas) => {
  return deltas.map((delta) => {
    const localDelta = _.cloneDeep(delta)

    if (INVALID_VALUES.includes(delta.before)) {
      localDelta.before = PLACEHOLDER_VALUE
    }
    if (INVALID_VALUES.includes(delta.after)) {
      localDelta.after = PLACEHOLDER_VALUE
    }

    if (typeof delta.before === 'object' && _.isEmpty(delta.before)) {
      localDelta.before = PLACEHOLDER_VALUE
    }
    if (typeof delta.after === 'object' && _.isEmpty(delta.after)) {
      localDelta.after = PLACEHOLDER_VALUE
    }

    localDelta.before = String(localDelta.before)
    localDelta.after = String(localDelta.after)

    return localDelta
  })
}

module.exports = ({ deltas, fieldLabelMaps, boId, connectedEntities }) => {
  const clonedDeltas = _.cloneDeep(deltas)
  let newDeltas = convertArrayDeltasToCsv(clonedDeltas)

  newDeltas = injectModalLabels({
    deltas: newDeltas,
    fieldLabelMaps,
    boId,
    connectedEntities,
  })

  newDeltas = convertDeltasToStringsOrNone(newDeltas)

  return newDeltas
}
