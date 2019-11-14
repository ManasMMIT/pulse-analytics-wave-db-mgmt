const subscriptionNodeIdMap = require('./subscription-nodeId-map')
const getAggPipeline = require('./getAggPipeline')

module.exports = async ({
  db,
  collectionName,
  subscriptionId,
  userNodesResources,
  date,
  query = {},
}) => {
  const subscriptionNodeId = subscriptionNodeIdMap[subscriptionId]

  const resources = userNodesResources
    .find(({ nodeId }) => nodeId === subscriptionNodeId)
      || { accounts: [], treatmentPlans: [] }

  const aggPipeline = getAggPipeline(collectionName, resources, date)

  // By Pulse convention, dbQuery is a JSON sometimes passed as arg from the frontend.
  // TODO: Devise deprecation plan for dbQuery special-casing.
  const { dbQuery, ...regularQueryFields } = query

  if (dbQuery) {
    const { postMatchAggregationPipeline, ...otherFields } = dbQuery
    aggPipeline.push({ $match: otherFields })

    // push multiple, arbitrary stages onto the end of the pipeline
    if (postMatchAggregationPipeline) aggPipeline.push(...postMatchAggregationPipeline)
  } else {
    aggPipeline.push({ $match: regularQueryFields })
  }

  const result = await db.collection(collectionName)
    .aggregate(aggPipeline)
    .toArray()

  return result
}
