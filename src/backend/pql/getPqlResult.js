const getAggPipelines = require('./getAggPipelines')
const _ = require('lodash')

module.exports = async (
  pql,
  { pulseCoreDb },
) => {
  // 1. build agg pipelines from pql
  const aggPipelines = getAggPipelines(pql)

  // 2. execute agg pipelines on collections
  const readOps = Object.keys(aggPipelines).map(collectionName => {
    const aggPipeline = aggPipelines[collectionName]

    return pulseCoreDb.collection(collectionName)
      .aggregate(aggPipeline)
      .toArray()
  })

  const result = await Promise.all(readOps)

  return _.flatten(result)
}
