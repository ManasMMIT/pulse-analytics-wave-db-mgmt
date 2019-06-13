/*
**WARNING**: this file has code meant to be used in the sequelize REPL

this js file can't/won't execute on its own
*/

const json = await csvToJson('pulse-core-psql/create-tables-util/clientRoles_5.29.19.csv')

// skip the tool level grouping because it's all payer tool
const roles = d3.nest().key(d => d.group).key(d => d.dashboard).entries(json)

const PAYER_TOOL_ID = 'a3f419de-ca7d-4498-94dd-04fb9f6b8777'
const MGMT_ID = 'db5a25db-a2c2-4da5-8bf7-c80e42cc13f7'
const ACCTS_ID = '25fde1b5-4c24-4d8a-ad89-aa4afaca4c52'

const PayerTool = await Node.findByPk(PAYER_TOOL_ID)
const ManagementDash = await Node.findByPk(MGMT_ID)
const AcctsDash = await Node.findByPk(ACCTS_ID)

for (const role of roles) {
  const currentRole = await Role.findOne({ where: { name: role.key } })
  const roleSitemapNode = await Node.create({ name: role.key, type: 'sitemap', order: 1 })

  await currentRole.addNode(roleSitemapNode)
  await currentRole.addNode(PayerTool)
  await roleSitemapNode.addChild(PayerTool)

  const dashboards = role.values

  for (const dashboard of dashboards) {
    const pages = dashboard.values

    if (dashboard.key === 'Management') {
      await currentRole.addNode(ManagementDash)
    } else if (dashboard.key === 'Accounts') {
      await currentRole.addNode(AcctsDash)
    }

    for (const page of pages) {
      const currentPage = await Node.findByPk(page.pageId)
      await currentRole.addNode(currentPage, { through: { order: page.order } })
    }
  }
}
