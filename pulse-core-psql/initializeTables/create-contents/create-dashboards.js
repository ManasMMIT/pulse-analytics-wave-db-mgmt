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

      dashboardsMap[_.camelCase(`${tool.name} ${dashboardName}`)] = dashboard

      await tool.addChild(dashboard)
    }
  }

  return dashboardsMap
}

module.exports = createDashboards
