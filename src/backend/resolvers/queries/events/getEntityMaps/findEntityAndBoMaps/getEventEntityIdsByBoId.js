const { BASIC } = require('../../event-meta-types')
const isValidObjectId = require('../../../../../utils/isValidObjectId')

module.exports = (events) => {
  return events.reduce((acc, event) => {
    // Relational entities live under a different field in the schema.
    // Basic here refers to single entity events, while the relational type has two entities.
    if (event.metaType === BASIC) {
      const {
        businessObject: { _id: boId },
      } = event
      acc[boId]
        ? acc[boId].push(event.entityId)
        : (acc[boId] = [event.entityId])
    } else {
      const { connectedEntities } = event

      connectedEntities.forEach(({ _id: entityId, boId }) => {
        acc[boId] ? acc[boId].push(entityId) : (acc[boId] = [entityId])
      })
    }

    addEntitiesEmbeddedInDeltasToMap(acc, event.deltas)

    return acc
  }, {})
}

const addEntitiesEmbeddedInDeltasToMap = (map, deltas) => {
  deltas.forEach((delta) => {
    const { field, before, after, boId } = delta
    const isIdField = /id/i.test(field)

    if (isIdField && field !== '_id') {
      addValidIdsForSingleDeltaToMap({ before, after, map, boId })
    }
  })
}

const addValidIdsForSingleDeltaToMap = ({ before, after, map, boId }) => {
  ;[before, after].forEach((value) => {
    /*
      ! Note: There's an edge case we have to guard against here where
      ! out of the events that are being fetched, say `indicationIds`
      ! is going from null to an empty array. And there isn't yet a
      ! delta in existence that's `indicationIds.0` -- outcome is that 
      ! the indication boId won't get put into the map, causing a destructuring breakage
      ! in `const { name } = boMap[delta.boId]` in src/backend/resolvers/queries/events/matchEventEntityBoData.js.
      ! The `if (isValidObjId(value))` condition doesn't account for cases where
      ! after flattening, `indicationIds` remains an empty array. So we need to make
      ! sure to always instantiate the boId entry in the map once, even if value
      ! isn't a valid object id.
    */
    if (!(boId in map)) map[boId] = []
    if (isValidObjectId(value)) map[boId].push(value)
  })
}
