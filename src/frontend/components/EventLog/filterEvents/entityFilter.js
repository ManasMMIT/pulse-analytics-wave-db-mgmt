import _ from 'lodash'

export default (events, entityIds) => {
  return entityIds.reduce(filterEventsByEntityId, events)
}

const filterEventsByEntityId = (events, entityId) =>
  events.filter(
    (event) =>
      isEntityTopLevel(event, entityId) ||
      isEntityInConnection(event, entityId) ||
      isEntityInDeltas(event, entityId)
  )

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
