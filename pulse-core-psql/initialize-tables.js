const connectToPsql = require('./connect-to-psql')

const {
  createUsersRolesClients,
  createNodes,
  createResources,
  // createPermissions,
  createRolesNodes,
  createRegionalTables,
} = require('./create-tables-util')

const initializeTables = async () => {
  const sequelize = await connectToPsql()

  const { User, Role, Client } = await createUsersRolesClients({ sequelize, shouldSeed: false })
  const Node = await createNodes({ sequelize, shouldSeed: false })

  const RoleNode = await createRolesNodes({
    sequelize,
    Role,
    Node,
    shouldSeed: false,
  })

  // regional breakdown can only be seeded by uploading CSV
  const RegionalBreakdown = await createRegionalTables({ sequelize })

  const Resource = await createResources({
    sequelize,
    RegionalBreakdown,
    shouldSeed: false,
  })

  // const Permission = await createPermissions({
  //   sequelize,
  //   RoleNode,
  //   Resource,
  //   shouldSeed: false,
  // })

  return {
    sequelize,
    models: {
      User,
      Role,
      Client,
      Node,
      RoleNode,
      RegionalBreakdown,
      Resource,
    }
  }
}

module.exports = initializeTables
