require('dotenv').load()
const Sequelize = require('sequelize')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI
const createUsersRolesClients = require('./create-users-roles-clients')
const createDashboards = require('./create-dashboards')
const createPages = require('./create-pages')
const createCards = require('./create-cards')
const createContents = require('./create-contents')
const createResources = require('./create-resources')
const createPermissions = require('./create-permissions')

const sslConfig = DB_PROD_LOADER_URI
  ? {
    ssl: true,
    dialectOptions: {
      ssl: { require: true }
    }
  }
  : {}

const sequelize = new Sequelize(DB_PROD_LOADER_URI || DB_LOCAL_LOADER_URI, {
  pool: {
    max: 150,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ...sslConfig
})

const executeDbOperations = async () => {
  // Test connection
  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

  const { User, Role, Client } = await createUsersRolesClients(sequelize, false)
  const Dashboard = await createDashboards(sequelize, false)
  const Page = await createPages(sequelize, Dashboard, false)
  const Card = await createCards(sequelize, Page, false)
  const Content = await createContents(sequelize, Card, false)

  const Resource = await createResources(sequelize, false)
  const Permission = await createPermissions({
    sequelize,
    Role,
    Content,
    Resource,
    shouldSeed: false
  })

  // User.dashboards.dashboards.pages.cards.contents.contents.resources

  Role.belongsToMany(Content, { through: Permission })
  Content.belongsToMany(Role, { through: Permission })

  Content.belongsToMany(Resource, { through: Permission })
  Resource.belongsToMany(Content, { through: Permission })

  // const adminData = await User.findOne(
  //   {
  //     where: { id: 'auth0|59e910a4c30a38053ab5452b' },
  //     include: [
  //       {
  //         model: Role,
  //         include: [
  //           {
  //             model: Content,
  //             include: [
  //               {
  //                 model: Permission,
  //                 where: {
  //                   roleId: 'admin-nested-role'
  //                 },
  //                 include: [
  //                   {
  //                     model: Resource
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // )
  // debugger

  // https://stackoverflow.com/questions/51965298/how-to-get-results-from-multiple-level-associations-in-sequelize
  const masterSitemap = await Dashboard.findAll(
    { include: [{ all: true, nested: true }] }
  )

  debugger
}

executeDbOperations()
