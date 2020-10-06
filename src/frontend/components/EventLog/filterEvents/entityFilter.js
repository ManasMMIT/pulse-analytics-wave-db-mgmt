import _ from 'lodash'

export default (events, entityIds) => {
  return entityIds.reduce(filterEventsByEntityId, events)
}

const filterEventsByEntityId = (events, entityId) => {
  return events.filter((event) => {
    const isTopLevel = isEntityTopLevel(event, entityId)
    const isInConnection = isEntityInConnection(event, entityId)
    const isInDeltas = isEntityInDeltas(event, entityId)

    return isTopLevel || isInConnection || isInDeltas
  })
}

const isEntityTopLevel = (event, entityId) => {
  return !_.isEmpty(event.entity) && event.entity._id === entityId
}

const isEntityInConnection = (event, entityId) => {
  return Boolean(
    (event.connectedEntities || []).find(
      ({ entity: { _id } }) => _id === entityId
    )
  )
}

const isEntityInDeltas = (event, entityId) => {
  return Boolean(
    event.deltas.find(
      ({ before, after }) =>
        (before || '') === entityId || (after || '') === entityId
    )
  )
}
