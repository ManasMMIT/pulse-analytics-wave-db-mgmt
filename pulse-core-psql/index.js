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

// const lilly = await Manufacturer.findByPk('b61feb9d-ca42-4039-97ce-a9151db9b44d')
// const testRolesOutput = await lilly.getRoles()
// const testRole = testRolesOutput[0]
// const manufacturer = await testRole.getManufacturer()
// const testUsers = await testRole.getUsers()
// const testUsers2 = await testRolesOutput[1].getUsers()

  // const TestUser = await User.findByPk('auth0|5c9b9d74017f3f535316cd75')
  // const TestRoles = await TestUser.getRoles()

  // const TestRole = TestRoles[0]
  // const blah = await TestRole.getUsers()

// const adminUser = await User.create(
//   {
//     username: 'admin',
//     roles: [
//       { type: 'pulse-admin' }
//     ]
//   },
//   {
//     include: [Role]
//   }
// )

// await User.create(
//   {
//     username: 'regeneron-sanofi',
//     roles: [
//       { type: 'regeneron-sanofi-admin' }
//     ]
//   },
//   {
//     include: [Role]
//   }
// )

// const [role2] = await Role.findAll({ where: { id: 2 } })


// const test = await adminUser.addRole(role2)
// console.log(test)

// const Content = sequelize.import('content', require('./models/content.js'))
// const Permission = sequelize.import('permission', require('./models/permission.js'))
// const RoleContent = sequelize.import('roles_contents', require('./models/roles_contents.js'))
// const Card = sequelize.import('card', require('./models/card.js'))
// const Page = sequelize.import('page', require('./models/page.js'))
// const Dashboard = sequelize.import('dashboard', require('./models/dashboard.js'))

// const seedData = async () => {
//   await User.bulkCreate([
//     {
//       username: 'admin',
//     },
//     {
//       username: 'demo',
//     },
//     {
//       username: 'regeneron-sanofi',
//     },
//   ])

//   await Role.bulkCreate([
//     {
//       type: 'pulse-admin',
//     },
//     {
//       type: 'regeneron-sanofi-admin',
//     },
//   ])

//   const content = [
//     {
//       type: 'summary',
//     },
//     {
//       type: 'coverage-quality',
//     },
//     {
//       type: 'competitive-access',
//     },
//     {
//       type: 'dupixent-relative-access',
//     },
//     {
//       type: 'review-timing-chart',
//     },
//     {
//       type: 'regional-targeting-map',
//     },
//     {
//       type: 'value-based-models',
//     },
//     {
//       type: 'strategic-accounts',
//     },
//     {
//       type: 'reports',
//     },
//     {
//       type: 'treatment-centers',
//     },
//   ]

//   await Content.bulkCreate(content)

//   // RoleContent.bulkCreate([
//   //   {
//   //     role_id:
//   //     content_id:
//   //   }
//   // ])

//   await Card.bulkCreate(content)

//   await Page.bulkCreate(content)

//   await Dashboard.sync({ force: true })

//   await Dashboard.bulkCreate([
//     {
//       title: 'Management'
//     }
//   ])
// }

// seedData().then(() => sequelize.close())

// if (process.env.DROP_AND_SEED) {
//   User.sync({ force: true })
//     .then(() => {
//       return User.bulkCreate([
//         {
//           name: 'Bob Smith',
//           username: 'bsmith',
//         },
//       ])
//     })
//     .catch(console.error)
// }
0
