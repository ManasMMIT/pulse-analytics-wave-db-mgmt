const _ = require('lodash')

const convertArrayDeltasToCsv = require('./convertArrayDeltasToCsv')
const injectModalLabels = require('./injectModalLabels')

module.exports = ({ deltas, fieldLabelMaps, boId, connectedEntities }) => {
  const clonedDeltas = _.cloneDeep(deltas)
  let result = convertArrayDeltasToCsv(clonedDeltas)
  result = injectModalLabels({
    deltas: result,
    fieldLabelMaps,
    boId,
    connectedEntities,
  })

  return result
}
