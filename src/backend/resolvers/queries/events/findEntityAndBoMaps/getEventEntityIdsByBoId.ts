// ! Note: We can mix import syntax for js ant ts files?
import isValidObjectId from '../../../../utils/isValidObjectId'
const { BASIC } = require('../event-meta-types')

// TODO: Raise boIds into global map
const PATHWAYS_BOID = '5eac3251ac8a01743081f28d'
const INDICATION_BOID = '5eac32c7ac8a01743081f299'
const PERSON_BOID = '5eea22d5adbf920fa4320487'

module.exports = (events: any) => {
  return events.reduce((acc: any, event: any) => {
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

      connectedEntities.forEach(({ _id: entityId, boId }: any) => {
        acc[boId] ? acc[boId].push(entityId) : (acc[boId] = [entityId])
      })
    }

    injectDeltaEntityIds(acc, event.deltas)

    return acc
  }, {})
}

const injectDeltaEntityIds = (map: object, deltas: any) => {
  deltas.forEach((delta: any) => {
    const { field, before, after } = delta
    const isIdField = /id/i.test(field)

    if (isIdField && field !== '_id') {
      const fieldBoId = getBoId(field)
      if (fieldBoId) delta.boId = fieldBoId
      addValidIdsToMap({ before, after, map, boId: fieldBoId })
    }
  })
}

const getBoId = (field: string) => {
  if (/pathway/i.test(field)) return PATHWAYS_BOID
  if (/(person|person)/i.test(field)) return PERSON_BOID
  if (/indication/i.test(field)) return INDICATION_BOID

  return null
}

const addValidIdsToMap = ({ before, after, map, boId }: ValidIdsInterface) => {
  [before, after].forEach((value) => {
    if (isValidObjectId(value)) {
      map[boId] ? map[boId].push(value) : (map[boId] = [value])
    }
  })
}

interface ValidIdsInterface {
  before: any
  after: any
  map: any
  boId: any
}
