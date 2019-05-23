const connectToPsql = require('./connect-to-psql')

const {
  createUsersRolesClients,
  createNodes,
  // createResources,
  // createPermissions,
  createRolesNodes,
  // createRegionalTables,
} = require('./create-tables-util')

const initializeTables = async () => {
  const sequelize = await connectToPsql()

  const { User, Role, Client } = await createUsersRolesClients({ sequelize, shouldSeed: false })
  const Node = await createNodes({ sequelize, shouldSeed: false })

  const RoleNode = await createRolesNodes({
    sequelize,
    Role,
    Node,
    shouldSeed: true,
  })

  return { User, Role, Client, Node, RoleNode }
}

module.exports = initializeTables
