const chain = require('../query-tables-util')

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

    const demoRole = await Role.findByPk('25903626-b6c1-49fe-8155-b06787ab0dbb')
    const adminRole = await Role.findByPk('e13031e3-9e3e-4dae-a879-51795babee56')
    const regeneronRole = await Role.findByPk('c04bfb71-9314-4a51-be72-480c3d7c82cf')
    const lillyAdminRole = await Role.findByPk('2a46665f-d4f7-40bf-a239-85f5b0cad344')

    // give admin role access to all contents except sitemap nodes for other roles
    const nodes = await Node.findAll()
    for (const node of nodes) {
      if (!['Eli Lilly-admin', 'Regeneron/Sanofi-admin', 'demo'].includes(node.name)) {
        // docs on adding attributes to the join table:
        // http://docs.sequelizejs.com/manual/associations.html#belongs-to-many-associations
        await adminRole.addNode(node, { through: { order: node.order } })
      }

      if (!['Eli Lilly-admin', 'Regeneron/Sanofi-admin', 'admin'].includes(node.name)) {
        // docs on adding attributes to the join table:
        // http://docs.sequelizejs.com/manual/associations.html#belongs-to-many-associations
        await demoRole.addNode(node, { through: { order: node.order } })
      }
    }

    const getStageToAssociateAllChildren = role => ({
      f: 'getChildren',
      cb: async children => {
        for (const child of children) {
          await role.addNode(child, { through: { order: child.order } })
        }
      }
    })

    // give lilly role access to all provider tool nodes
    const lillyStageToAssociateAllChildren = getStageToAssociateAllChildren(lillyAdminRole)

    chain(Node, [
      {
        f: 'findOne',
        o: { where: { name: 'Eli Lilly-admin' } },
        cb: sitemapNode => lillyAdminRole.addNode(sitemapNode, { through: { order: 1 } })
      },
      lillyStageToAssociateAllChildren, // Provider tool
      lillyStageToAssociateAllChildren, // Overview, Mgmt, Accts dashes
      lillyStageToAssociateAllChildren, // Overview tool cards, Mgmt and Accts pages
      lillyStageToAssociateAllChildren, // cards for Mgmt and Accts
    ])


    // give regeneron role access to selective parts of payer tool
    const regeneronStageToAssociateAllChildren = getStageToAssociateAllChildren(regeneronRole)

    const regeneronForbiddenPayerPages = [
      'Competitive Access',
      'Treatment Centers',
      'Value Based Models'
    ]

    chain(Node, [
      {
        f: 'findOne',
        o: { where: { name: 'Regeneron/Sanofi-admin' } },
        cb: sitemapNode => regeneronRole.addNode(sitemapNode, { through: { order: 1 } })
      },
      regeneronStageToAssociateAllChildren, // Payer tool
      {
        f: 'getChildren', // Mgmt, Accts dashes but NOT the non-existent Overview dash
        cb: async children => {
          for (const child of children) {
            if (['Management', 'Accounts'].includes(child.name)) {
              await regeneronRole.addNode(child, { through: { order: child.order } })
            }
          }
        }
      },
      {
        // Mgmt pages EXCEPT: Competitive Access, Treatment Centers, Value Based Models;
        // Access to all accts pages
        f: 'getChildren',
        cb: async children => {
          children.sort((a, b) => a.order - b.order)

          let i = 0
          let j = 0
          for (const child of children) {
            if (!regeneronForbiddenPayerPages.includes(child.name)) {
              const [parent] = await child.getParents()

              if (parent.name === 'Management') {
                await regeneronRole.addNode(child, { through: { order: ++i } })
              } else {
                await regeneronRole.addNode(child, { through: { order: ++j } })
              }
            }
          }
        }
      },
    ])
  }

  return RoleNode
}

module.exports = createRolesNodes
