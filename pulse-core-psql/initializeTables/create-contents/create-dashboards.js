const _ = require('lodash')

const createDashboards = async Content => {
  const providerTool = await Content.create({
    name: 'Provider Targeted Accounts',
    type: 'tool',
  })

  const payerTool = await Content.create({
    name: 'Payer',
    type: 'tool',
  })

  const dashboardsMap = {}

  for (const tool of [providerTool, payerTool]) {
    for (const dashboardName of ['Overview', 'Management', 'Accounts']) {
      const dashboard = await Content.create({
        name: dashboardName,
        type: 'dashboard',
      })

      const firstWordOfToolName = tool.name.split(' ')[0].toLowerCase()
      const firstWordOfDashName = dashboardName.toLowerCase()
      const key = `${firstWordOfToolName}_${firstWordOfDashName}`
      dashboardsMap[key] = dashboard

      await tool.addChild(dashboard)
    }
  }

  return dashboardsMap
}

module.exports = createDashboards
