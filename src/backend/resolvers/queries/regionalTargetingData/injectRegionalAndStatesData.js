const processBreakdowns = require('./processBreakdowns')

const REGIONAL_TARGETING_ID = '4e6304a5-4847-474f-a8f8-9cbeb8a77677'

module.exports = async ({ targetTeam, result, db }) => {
  const { breakdowns } = await getRegionalBreakdown(targetTeam, db)
  processBreakdowns(breakdowns, result)

  return result
}

const getRegionalBreakdown = async (targetTeam, db) => {
  return await db
    .collection('roles.nodes.regionalBreakdowns')
    .findOne({ nodeId: REGIONAL_TARGETING_ID, roleId: targetTeam._id })
}
