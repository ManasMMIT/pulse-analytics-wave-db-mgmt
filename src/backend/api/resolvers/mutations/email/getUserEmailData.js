const SUBSCRIPTION_MAP = require('./subscription-map')
const utils = require('./mjmlTemplates/pathwaysAlerts/utils')

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

  const { processAlerts } = SUBSCRIPTION_MAP[subscription]

  const alerts = await processAlerts(
    subscription,
    pulseDevDb,
    date,
    userNodesResources,
  )

  const [year, month] = date.split('-')

  const emailDate = { year, month }

  return {
    ...user,
    data: {
      ...utils,
      data: alerts,
      emailDate,
    }
  }
}
