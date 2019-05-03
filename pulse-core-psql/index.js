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

  const Resource = await sequelize.import('resource', require('./models/resource'))
  const Permission = await sequelize.import('permission', require('./models/permission'))

  Permission.belongsTo(Role)
  Permission.belongsTo(Content)
  Permission.belongsTo(Resource)
  Role.hasMany(Permission, { onDelete: 'cascade' })
  Content.hasMany(Permission, { onDelete: 'cascade' })
  Resource.hasMany(Permission, { onDelete: 'cascade' })

  // await Resource.sync({ force: true })
  // await Permission.sync({ force: true })

  // const regionalBreakdownResource = await Resource.findByPk(1)
  // const regionalBreakdownResource2 = await Resource.create({
  //   type: 'regionalBreakdown',
  //   sourceId: 2,
  // })
  // const regionalMap1Content = await Content.findByPk(15)
  // const roleForMap1 = await Role.findByPk('5404d17a-d830-4e68-ba5a-623abf96ab74')

  // const firstPermission = await Permission.create({
  //   contentOrder: 1,
  //   resourceId: 1,
  //   contentId: 15,
  //   roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74'
  // })

  // const secondPermission = await Permission.create({
  //   contentOrder: 1,
  //   resourceId: 1,
  //   contentId: 14,
  //   roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74'
  // })
  // debugger

  // const thirdPermission = await Permission.create({
  //   contentOrder: 1,
  //   resourceId: 2,
  //   contentId: 15,
  //   roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74'
  // })
  // debugger

  // const fourthPermission = await Permission.create({
  //   contentOrder: 1,
  //   resourceId: 1,
  //   contentId: 15,
  //   roleId: '31c5af56-e198-494e-bda9-d5f6195e5fa5'
  // })
  // debugger

  const fifthPermission = await Permission.create({
    contentOrder: 1,
    resourceId: 1,
    contentId: 19,
    roleId: '55f7f764-4df2-4f83-9e06-7cf937c1031a'
  })
  debugger

  const finalPermission = await Permission.create({
    contentOrder: 1,
    resourceId: 1,
    contentId: 15,
    roleId: '5404d17a-d830-4e68-ba5a-623abf96ab74'
  })
  debugger

  // debugger

  // await regionalBreakdownResource.addPermission(firstPermission)
  // debugger
  // await regionalMap1Content.addPermission(firstPermission)
  // debugger
  // await roleForMap1.addPermission(firstPermission)
  // debugger
  // await firstPermission.setResource(regionalBreakdownResource)
  // debugger
  // await firstPermission.setContent(regionalMap1Content)
  // debugger
  // await firstPermission.setRole(roleForMap1)
  // debugger

  // const testSave = await firstPermission.save()
  // debugger

  // const resourceCheck = await firstPermission.getResource()
  // const contentCheck = await firstPermission.getContent()
  // const roleCheck = await firstPermission.getRole()
  // debugger

  // const permission1Check = await resourceCheck.getPermissions()
  // const permission2Check = await contentCheck.getPermissions()
  // const permission3Check = await roleCheck.getPermissions()
}

executeDbOperations()
