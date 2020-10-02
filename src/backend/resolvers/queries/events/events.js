const _ = require('lodash')

const findInitialEvents = require('./findInitialEvents')
const findModalFieldLabelMap = require('./findModalFieldLabelMap')
const findEntityAndBoMaps = require('./findEntityAndBoMaps')

const matchEventEntityBoData = require('./matchEventEntityBoData')
const formatEventDeltaFields = require('./formatEventDeltaFields')

module.exports = async (parent, args, { pulseCoreDb }, info) => {
  const eventsOp = findInitialEvents(pulseCoreDb)
  const fieldLabelMapOp = findModalFieldLabelMap(pulseCoreDb)

  const [events, fieldLabelMap] = await Promise.all([eventsOp, fieldLabelMapOp])

  const { entityMap, boMap } = await findEntityAndBoMaps(events, pulseCoreDb)

  const enrichedEvents = matchEventEntityBoData(events, entityMap, boMap)

  const formattedEvents = enrichedEvents.map(({ deltas, ...event }) => {
    const { boId, connectedEntities } = event

    const formattedDeltas = formatEventDeltaFields({
      deltas,
      fieldLabelMap,
      boId,
      connectedEntities,
    })

    return {
      ...event,
      deltas: formattedDeltas,
    }
  })

  return _.orderBy(formattedEvents, ({ timestamp }) => new Date(timestamp), [
    'desc',
  ])
}
