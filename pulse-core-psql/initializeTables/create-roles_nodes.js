const createRolesNodes = async ({
  sequelize,
  Role,
  Node,
  shouldSeed,
}) => {
  const RoleNode = await sequelize.import('roles_nodes', require('./models/roles_nodes'))

  Role.belongsToMany(Node, { through: RoleNode })
  Node.belongsToMany(Role, { through: RoleNode })

  /*
    The hasMany below seems redundant after the above associations but to get
    from roles to resources, we have to be able to join roles to roles_nodes,
    and then roles_nodes to resources (through the permissions table); otherwise,
    sequelize #includes errors, saying there's no association between roles and roles_nodes.

    I didn't specify a cascade deletion in the hasMany below because
    the previous many-to-many association should take care of the cascade deletion.
    See: http://docs.sequelizejs.com/manual/associations.html#belongs-to-many-associations:
    "if you delete or update a row from one side of an n:m association, all the rows
    in the join table referencing that row will also be deleted or updated"

    Tested this on 5/10/19 and seemed to work without adding { onDelete: 'cascade }
  */
  Role.hasMany(RoleNode)

  if (shouldSeed) {
    await RoleNode.sync({ force: true })

    // const sitemaps = await Node.findAll({ where: { type: 'sitemap' } })
    // const tools = await Node.findAll({ where: { type: 'tool' } })
    // const dashboards = await Node.findAll({ where: { type: 'dashboard' } })
    // const pages = await Node.findAll({ where: { type: 'page' } })
    // const cards = await Node.findAll({ where: { type: 'card' } })

    // // give admin role access to everything
    // const adminRole = await Role.findByPk('e13031e3-9e3e-4dae-a879-51795babee56')
    // await adminRole.addNodes(nodes)

    // const adminEntries = []
    // for (let i = 1; i < 26; i += 1) {
    //   adminEntries.push({
    //     order: 1,
    //     nodeId: i,
    //     roleId: 'e13031e3-9e3e-4dae-a879-51795babee56',
    //   })
    // }

    // const regeneronNodeIds = [9, 10, 11, 13, 15, 18, 19, 20, 21, 22, 23, 24]
    // const regeneronEntries = regeneronNodeIds.map(nodeId => ({
    //   order: 1,
    //   nodeId,
    //   roleId: 'c04bfb71-9314-4a51-be72-480c3d7c82cf',
    // }))

    // const lillyAdminNodeIds = [1, 2, 3, 4, 5, 6, 7, 8]
    // const lillyEntries = lillyAdminNodeIds.map(nodeId => ({
    //   order: 1,
    //   nodeId,
    //   roleId: '2a46665f-d4f7-40bf-a239-85f5b0cad344',
    // }))

    // await RoleNode.bulkCreate([
    //   ...adminEntries,
    //   ...regeneronEntries,
    //   ...lillyEntries,
    // ])
  }

  return RoleNode
}

module.exports = createRolesNodes
