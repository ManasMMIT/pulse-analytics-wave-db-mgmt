require('dotenv').load()
const Sequelize = require('sequelize')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI
const createUsersRolesClients = require('./create-users-roles-clients')
const createDashboards = require('./create-dashboards')
const createPages = require('./create-pages')
const createCards = require('./create-cards')
const createContents = require('./create-contents')

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
}

executeDbOperations()
