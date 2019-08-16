require('dotenv').load()
const Sequelize = require('sequelize')

const {
  initializeUsersRolesClients,
  initializeNodes,
  initializeResources,
  initializePermissions,
  initializeRolesNodes,
  initializeRegionalTables,
} = require('./initialize-models')

const PSQL_LOADER_URI = process.env.PSQL_LOADER_URI
const isProductionEnv = PSQL_LOADER_URI.includes('amazonaws')

const sslConfig = isProductionEnv
  ? {
    ssl: true,
    dialectOptions: {
      ssl: { require: true }
    }
  }
  : {}

const sequelize = new Sequelize(PSQL_LOADER_URI, sslConfig)

sequelize
  .authenticate()
  .then(() => {
    console.log(`-----Connected to PostgreSQL at ${PSQL_LOADER_URI}-----`)
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

const { User, Role, Client } = initializeUsersRolesClients(sequelize)
const Node = initializeNodes(sequelize)

const RoleNode = initializeRolesNodes({ sequelize, Role, Node })

const RegionalBreakdown = initializeRegionalTables(sequelize)

const Resource = initializeResources({ sequelize, RegionalBreakdown })

const Permission = initializePermissions({
  sequelize,
  RoleNode,
  Resource,
})

module.exports = {
  sequelize,
  models: {
    User,
    Role,
    Client,
    Node,
    RoleNode,
    RegionalBreakdown,
    Resource,
  },
}
