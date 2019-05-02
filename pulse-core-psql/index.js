require('dotenv').load()
const Sequelize = require('sequelize')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI
const syncAuth0WithDb = require('./sync-auth0-psql')
const createDashboards = require('./create-dashboards')
const createPages = require('./create-pages')
// const createCards = require('./create-cards')

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

  const { User, Role, Client } = await syncAuth0WithDb(sequelize, false)
  const Dashboard = await createDashboards(sequelize, false)
  const Page = await createPages(sequelize, Dashboard, false)

  const testUser = await User.findOne()
  const testRoles = await testUser.getRoles()
  const testRole = testRoles[0]
  const testClient = await testRole.getClient()

  const testDashboard = await Dashboard.findOne({ where: { name: 'Management' } })
  const testPages = await testDashboard.getPages()
  debugger
  const testPage = testPages[0]
  const testDashboard2 = await testPage.getDashboard()
  debugger

  // const Card = await createPages(sequelize, Page, false)
}

executeDbOperations()
