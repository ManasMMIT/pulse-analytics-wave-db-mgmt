const _ = require('lodash')
const getToolOrgsWithConnectionsPipeline = require('./getToolOrgsWithConnectionsPipeline')

const getOrgsAndConnectionsByTool = async ({
  db,
  toolId,
  extraProjectionFields = {}
}) => {
  const result = await db
    .collection('organizations')
    .aggregate(getToolOrgsWithConnectionsPipeline(toolId, extraProjectionFields))
    .collation({ locale: 'en' })
    .sort({ organization: 1 })
    .toArray()

  return result
}

module.exports = getOrgsAndConnectionsByTool
