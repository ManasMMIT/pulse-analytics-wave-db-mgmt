const getUserPathwaysAlerts = require('./getUserPathwaysAlerts')
const formatPathwaysAlerts = require('./formatPathwaysAlerts')

module.exports = async (
  subscription,
  pulseDevDb,
  date,
  userNodesResources,
) => {
  let userPathwaysAlerts = await getUserPathwaysAlerts({
    pulseDevDb,
    subscriptionId: subscription,
    userNodesResources: userNodesResources.resources,
  })

  const [year, month] = date.split('-')

  // NOTE: In the future, store dates in the DB as dates that can be filtered by MongoDB rather than as a step afterward
  const filteredUserAlertsData = userPathwaysAlerts
    .filter(alert => {
      const [alertYear, alertMonth] = alert.alertDate.split('-')

      return (
        year === alertYear
          && month === alertMonth
      )
    })

  return formatPathwaysAlerts(filteredUserAlertsData)
}
