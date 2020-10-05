const formatEventDeltaFields = require('./formatEventDeltaFields')

const getFormattedEvents = (enrichedEvents, fieldLabelMaps) => {
  return enrichedEvents.map(({ deltas, ...event }) => {
    const { boId, connectedEntities } = event

    const formattedDeltas = formatEventDeltaFields({
      deltas,
      fieldLabelMaps,
      boId,
      connectedEntities,
    })

    return {
      ...event,
      deltas: formattedDeltas,
    }
  })
}

module.exports = getFormattedEvents
