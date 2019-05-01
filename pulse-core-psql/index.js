require('dotenv').load()
const Sequelize = require('sequelize')
const _ = require('lodash')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI
const getAuth0Data = require('./process_auth0_data')

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

  const User = await sequelize.import('user', require('./models/user.js'))
  const Role = await sequelize.import('role', require('./models/role.js'))
  const UserRole = await sequelize.import('users_roles', require('./models/users_roles.js'))
  const Manufacturer = await sequelize.import('manufacturer', require('./models/manufacturer.js'))

  User.belongsToMany(Role, { through: UserRole })
  Role.belongsToMany(User, { through: UserRole })

  Manufacturer.hasMany(Role, { onDelete: 'cascade' })
  Role.belongsTo(Manufacturer)

  await sequelize.sync({ force: true })

  const { users, roles, manufacturers } = await getAuth0Data()

  await User.bulkCreate(users)

  for (const role of roles) {
    const CurrentRole = await Role.create({
      id: role._id,
      name: role.name,
      description: role.description,
    })

    const { members } = role

    if (!_.isEmpty(members)) {
      for (memberId of members) {
        const TargetUser = await User.findByPk(memberId)
        await CurrentRole.addUser(TargetUser)
      }
    }
  }

  for (const manufacturer of manufacturers) {
    const CurrentManufacturer = await Manufacturer.create({
      id: manufacturer._id,
      name: manufacturer.name,
      description: manufacturer.description,
    })

    const { nested: roles } = manufacturer

    if (!_.isEmpty(roles)) {
      for (const roleId of roles) {
        const TargetRole = await Role.findByPk(roleId)
        await CurrentManufacturer.addRole(TargetRole)
      }
    }
  }
}

executeDbOperations()
