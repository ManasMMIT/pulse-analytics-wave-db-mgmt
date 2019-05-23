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

    const adminRole = await Role.findByPk('e13031e3-9e3e-4dae-a879-51795babee56')
    const regeneronRole = await Role.findByPk('c04bfb71-9314-4a51-be72-480c3d7c82cf')
    const lillyAdminRole = await Role.findByPk('2a46665f-d4f7-40bf-a239-85f5b0cad344')

    const nodes = await Node.findAll()

    // give admin role all contents except sitemap nodes for other roles
    for (const node of nodes) {
      if (!['Eli Lilly-admin', 'Regeneron/Sanofi-admin'].includes(node.name)) {
        await adminRole.addNode(node, { through: { order: node.order } })
      }
    }



  }

  return RoleNode
}

module.exports = createRolesNodes
