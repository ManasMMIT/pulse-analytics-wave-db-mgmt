const _ = require('lodash')

const aggPipeline = require('./agg-pipeline')
const matchEventEntityBoData = require('./matchEventEntityBoData')
const getEntityAndBoMaps = require('./getEntityAndBoMaps')

module.exports = async (parent, args, { pulseCoreDb }, info) => {
  const events = await pulseCoreDb
    .collection('events')
    .aggregate(aggPipeline, { allowDiskUse: true })
    .toArray()

  const { entityMap, boMap } = await getEntityAndBoMaps(events, pulseCoreDb)

  const enrichedEvents = matchEventEntityBoData(events, entityMap, boMap)

  return _.orderBy(enrichedEvents, ({ timestamp }) => new Date(timestamp), [
    'desc',
  ])
}
