const getUserPathwaysAlerts = require('./getUserPathwaysAlerts')
const formatPathwaysAlerts = require('./formatPathwaysAlerts')
const utils = require('../mjmlTemplates/pathwaysAlerts/utils')

module.exports = async (
  user,
  subscription,
  pulseDevDb,
  date,
) => {
  const { _id } = user

  const userNodesResources = await pulseDevDb
    .collection('users.nodes.resources')
    .findOne({ _id })

  let filteredUserAlertsData = await getUserPathwaysAlerts({
    pulseDevDb,
    subscriptionId: subscription,
    userNodesResources: userNodesResources.resources,
    date,
  })

  const [year, month] = date.split('-')

  // NOTE: In the future, store dates in the DB as dates that can be
  // be filtered by MongoDB rather than as a step afterward
  filteredUserAlertsData = filteredUserAlertsData.filter(alert => {
    const [alertYear, alertMonth] = alert.alertDate.split('-')

    return (year === alertYear && month === alertMonth)
  })

  const formattedAlerts = formatPathwaysAlerts(filteredUserAlertsData)

  const emailDate = { year, month }

  return {
    ...user,
    data: {
      ...utils,
      data: formattedAlerts,
      emailDate,
    }
  }
}
