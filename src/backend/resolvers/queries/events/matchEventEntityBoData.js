/*
  ! NOTE: Delta Entity Matching is BRITTLE

  ? If deltas aren't being enriched properly, check
  * 1. BO_LABEL_MAP to make sure the business object has a label callback
  * 2. The regex matching in `getEventEntityIdsBoId`

  TODO: As events grow, we'll need to manually scale places 1 and 2.
*/

const BO_LABEL_MAP = require('./bo-label-map')
const { BASIC } = require('./event-meta-types')

module.exports = (events, entityMap, boMap) => {
  return events.map((event) => {
    const enrichEventEntityArgs = {
      event,
      entityMap,
      boMap,
    }

    return event.metaType === BASIC
      ? enrichBasicEventEntity(enrichEventEntityArgs)
      : enrichRelationalEventEntities(enrichEventEntityArgs)
  })
}

const enrichBasicEventEntity = ({ event, entityMap, boMap }) => {
  const {
    _id,
    userId,
    username,
    action,
    timestamp,
    entityId,
    businessObject,
    deltas,
    metaType,
  } = event

  const { _id: boId } = businessObject
  const { name: boName } = boMap[boId]

  const entity = entityMap[entityId]

  const entityLabelFunc = BO_LABEL_MAP[boName]
  const label = entity && entityLabelFunc(entity)

  enrichDeltas({ deltas, entityMap, boMap })

  return {
    _id,
    userId,
    username,
    action,
    entity: { ...entity, label },
    timestamp,
    boId,
    boName,
    deltas,
    metaType,
  }
}

const enrichRelationalEventEntities = ({ event, entityMap, boMap }) => {
  const {
    _id,
    userId,
    username,
    action,
    timestamp,
    deltas,
    connectedEntities,
    metaType,
  } = event

  const { _id: entityId1, boId: boId1 } = connectedEntities[0]
  const { name: boName1 } = boMap[boId1]
  let entity1 = entityMap[entityId1]
  const entityLabelFunc1 = BO_LABEL_MAP[boName1]
  const label1 = entity1 && entityLabelFunc1(entity1)
  entity1 = { ...entity1, label: label1 }

  const { _id: entityId2, boId: boId2 } = connectedEntities[1]
  const { name: boName2 } = boMap[boId2]
  let entity2 = entityMap[entityId2]
  const entityLabelFunc2 = BO_LABEL_MAP[boName2]
  const label2 = entity2 && entityLabelFunc2(entity2)
  entity2 = { ...entity2, label: label2 }

  enrichDeltas({ deltas, entityMap, boMap })

  const topLevelFields = {
    _id,
    userId,
    username,
    action,
    timestamp,
    deltas,
    metaType,
  }

  const actualConnectedEntities = [
    { entity: entity1, boName: boName1, boId: boId1 },
    { entity: entity2, boName: boName2, boId: boId2 },
  ]

  return {
    ...topLevelFields,
    connectedEntities: actualConnectedEntities,
  }
}

const enrichDeltas = ({ deltas, entityMap, boMap }) => {
  deltas = deltas.map((delta) => {
    if (delta.boId) {
      const { name } = boMap[delta.boId]
      const entityLabelFunc = BO_LABEL_MAP[name]

      if (entityLabelFunc) {
        // ! Stubbing because either side of delta could be null
        delta.before =
          entityMap[delta.before] && entityLabelFunc(entityMap[delta.before])
        delta.after =
          entityMap[delta.after] && entityLabelFunc(entityMap[delta.after])
      }
    }

    return delta
  })
}
