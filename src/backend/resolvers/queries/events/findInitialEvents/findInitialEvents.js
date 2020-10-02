const aggPipeline = require('./agg-pipeline')

module.exports = (pulseCoreDb) => {
  return pulseCoreDb
    .collection('events')
    .aggregate(aggPipeline, { allowDiskUse: true })
    .toArray()
}
