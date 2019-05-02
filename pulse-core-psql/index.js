require('dotenv').load()
const Sequelize = require('sequelize')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI
const syncAuth0WithDb = require('./sync-auth0-psql')
const createDashboards = require('./create-dashboards')

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

  // const { User, Role, Client } = await syncAuth0WithDb(sequelize);
  const Dashboard = await createDashboards(sequelize);

  const Page = await sequelize.import('page', require('./models/page'))
  Page.belongsTo(Dashboard)
  Dashboard.hasMany(Page, { onDelete: 'cascade' })

  await Page.sync({ force: true })

  const ProviderMgmt = Dashboard.findByPk(3)
  const ProviderAccts = Dashboard.findByPk(5)
  const PayerMgmt = Dashboard.findByPk(4)
  const PayerAccts = Dashboard.findByPk(6)

  const providerMgmtPages = [
    'Regional Footprint',
    'Internal Pharmacy',
    'Pathways',
    'Alternative Payment Models',
  ]

  for (const pageName of providerMgmtPages) {
    const createdPage = await Page.create({ name: pageName })
    await ProviderMgmt.addPage(createdPage)
  }

  const providerAcctsPages = [
    'Business Model & Capabilities',
    'Clinical Sophistication',
    'Value Based Care',
    'Manufacturer Engagement',
  ]

  for (const pageName of providerAcctsPages) {
    const createdPage = await Page.create({ name: pageName })
    await ProviderAccts.addPage(createdPage)
  }

  const payerMgmtPages = [
    'Summary',
    'Quality of Access',
    'Dupixent Relative Access',
    'Competitive Access',
    'Review Timing',
    'Treatment Centers',
    'Regional Targeting',
    'Regional Targeting',
    'Value Based Models',
    'Strategic Accounts',
    'Reports'
  ]

  for (const pageName of payerMgmtPages) {
    const createdPage = await Page.create({ name: pageName })
    await PayerMgmt.addPage(createdPage)
  }

  const payerAcctsPages = [
    'Summary & Engagement',
    'Overview',
    'Management Capabilities',
    'Review Process',
    'Product Coverage',
  ]

  for (const pageName of payerAcctsPages) {
    const createdPage = await Page.create({ name: pageName })
    await PayerAccts.addPage(createdPage)
  }

  const test1 = await ProviderMgmt.getPages()
  const test2 = await ProviderAccts.getPages()
  const test3 = await PayerMgmt.getPages()
  const test4 = await PayerAccts.getPages()
  const asdf = await Page.findByPk(1)
  const test5 = asdf.getDashboard()
  debugger
  const test6 = await Page.findByPk(1).getDashboard()

  // const Content = sequelize.import('content', require('./models/content'))
  // const Permission = sequelize.import('permission', require('./models/permission'))
  // const Resource = sequelize.import('resource', require('./models/resource'))

  // Role.hasMany(Permission, { onDelete: 'cascade' })
  // Permission.belongsTo(Role)

  // Content.hasMany(Permission, { onDelete: 'cascade' })
  // Permission.belongsTo(Content)

  // Resource.hasMany(Permission, { onDelete: 'cascade' })
  // Permission.belongsTo(Resource)
}

executeDbOperations()
