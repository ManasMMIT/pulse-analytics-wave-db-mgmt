const getUserPathwaysAlerts = require('./getUserPathwaysAlerts')
const formatPathwaysAlerts = require('./formatPathwaysAlerts')

module.exports = async (
  subscription,
  pulseDevDb,
  date,
  userNodesResources,
) => {
  const [year, month] = date.split('-').map(Number)

  let userPathwaysAlerts = await getUserPathwaysAlerts({
    pulseDevDb,
    subscriptionId: subscription,
    userNodesResources: userNodesResources.resources,
    monthYearFilterParams: { month, year }
  })

  return formatPathwaysAlerts(userPathwaysAlerts)
}
