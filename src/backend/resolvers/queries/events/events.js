const _ = require('lodash')

const findInitialEvents = require('./findInitialEvents')
const getEntityMaps = require('./getEntityMaps')

const matchEventEntityBoData = require('./matchEventEntityBoData')
const getFormattedEvents = require('./getFormattedEvents')

module.exports = async (parent, args, { pulseCoreDb }, info) => {
  const events = await findInitialEvents(pulseCoreDb)

  const { fieldLabelMaps, entityMap, boMap } = await getEntityMaps(
    events,
    pulseCoreDb
  )

  const enrichedEvents = matchEventEntityBoData(events, entityMap, boMap)
  const formattedEvents = getFormattedEvents(enrichedEvents, fieldLabelMaps)
  const orderedEvents = _.orderBy(formattedEvents, coerceToTimestamps, ['desc'])

  return orderedEvents
}

const coerceToTimestamps = ({ timestamp }) => new Date(timestamp)
