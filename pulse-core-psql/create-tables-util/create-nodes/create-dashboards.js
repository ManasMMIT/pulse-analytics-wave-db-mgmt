const _ = require('lodash')

const createDashboards = async ({
  Node,
  sitemaps: {
    demoSitemap,
    adminSitemap,
    lillyAdminSitemap,
    regeneronAdminSitemap,
  },
}) => {
  const providerTool = await Node.create({
    name: 'Provider Targeted Accounts',
    type: 'tool',
    order: 3,
  })

  const payerTool = await Node.create({
    name: 'Payers',
    type: 'tool',
    order: 1,
  })

  await demoSitemap.addChildren([providerTool, payerTool])
  await adminSitemap.addChildren([providerTool, payerTool])
  await lillyAdminSitemap.addChild(providerTool)
  await regeneronAdminSitemap.addChild(payerTool)

  const dashboards = {}

  for (const tool of [providerTool, payerTool]) {
    let i = 0

    for (const dashboardName of ['Overview', 'Management', 'Accounts']) {
      const dashboard = await Node.create({
        name: dashboardName,
        type: 'dashboard',
        order: ++i,
      })

      const firstWordOfToolName = tool.name.split(' ')[0].toLowerCase()
      const firstWordOfDashName = dashboardName.toLowerCase()
      const key = `${firstWordOfToolName}_${firstWordOfDashName}`
      dashboards[key] = dashboard

      await tool.addChild(dashboard)
    }
  }

  return dashboards
}

module.exports = createDashboards
