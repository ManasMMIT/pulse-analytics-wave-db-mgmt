const findModalFieldLabelMaps = require('./findModalFieldLabelMaps')
const findEntityAndBoMaps = require('./findEntityAndBoMaps')

const getEntityMaps = async (events, pulseCoreDb) => {
  const findFieldLabelMapOp = findModalFieldLabelMaps(pulseCoreDb)

  const findEntityAndBoMapsOp = findEntityAndBoMaps(events, pulseCoreDb)

  const [fieldLabelMaps, { entityMap, boMap }] = await Promise.all([
    findFieldLabelMapOp,
    findEntityAndBoMapsOp,
  ])

  return {
    fieldLabelMaps,
    entityMap,
    boMap,
  }
}

module.exports = getEntityMaps
