const _ = require('lodash')

const createDashboards = async ({
  Content,
  sitemaps: {
    adminSitemap,
    lillyAdminSitemap,
    regeneronAdminSitemap,
  },
}) => {
  const providerTool = await Content.create({
    name: 'Provider Targeted Accounts',
    type: 'tool',
  })

  const payerTool = await Content.create({
    name: 'Payer',
    type: 'tool',
  })

  await adminSitemap.addChildren([providerTool, payerTool])
  await lillyAdminSitemap.addChild(providerTool)
  await regeneronAdminSitemap.addChild(payerTool)

  const dashboards = {}

  for (const tool of [providerTool, payerTool]) {
    for (const dashboardName of ['Overview', 'Management', 'Accounts']) {
      const dashboard = await Content.create({
        name: dashboardName,
        type: 'dashboard',
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
