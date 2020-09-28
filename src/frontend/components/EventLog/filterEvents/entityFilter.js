import _ from 'lodash'

export default (events, entityIds) => {
  if (entityIds.length === 1) {
    const [entityId] = entityIds
    return events.filter((event) => {
      return (
        isEntityTopLevel(event, entityId) ||
        isEntityInConnection(event, entityId) ||
        isEntityInDeltas(event, entityId)
      )
    })
  } else if (entityIds.length === 2) {
    // TODO: Support relational events filtering
    return events
  }

  return events
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
