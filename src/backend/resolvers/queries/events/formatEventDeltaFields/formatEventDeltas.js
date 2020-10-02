const _ = require('lodash')

const convertArrayDeltasToCsv = require('./convertArrayDeltasToCsv')
const injectModalLabels = require('./injectModalLabels')

module.exports = ({ deltas, fieldLabelMap, boId, connectedEntities }) => {
  const clonedDeltas = _.cloneDeep(deltas)
  let result = convertArrayDeltasToCsv(clonedDeltas)
  result = injectModalLabels({
    deltas: result,
    fieldLabelMap,
    boId,
    connectedEntities,
  })

  return result
}
