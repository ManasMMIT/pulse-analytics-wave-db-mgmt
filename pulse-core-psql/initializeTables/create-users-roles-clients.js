const _ = require('lodash')
const getAuth0Data = require('../processAuthData')

const createUsersRolesClients = async ({ sequelize, shouldSeed }) => {
  const User = await sequelize.import('user', require('./models/user'))
  const Role = await sequelize.import('role', require('./models/role'))
  const UserRole = await sequelize.import('users_roles', require('./models/users_roles'))
  const Client = await sequelize.import('client', require('./models/client'))

  User.belongsToMany(Role, { through: UserRole })
  Role.belongsToMany(User, { through: UserRole })

  Client.hasMany(Role, { onDelete: 'cascade' })
  Role.belongsTo(Client)

  if (shouldSeed) {
    await User.sync({ force: true })
    await Role.sync({ force: true })
    await UserRole.sync({ force: true })
    await Client.sync({ force: true })

    const { users, roles, clients } = await getAuth0Data()

    await User.bulkCreate(users)

    for (const role of roles) {
      const currentRole = await Role.create({
        id: role._id,
        name: role.name,
        description: role.description,
      })

      const { members } = role

      if (!_.isEmpty(members)) {
        for (memberId of members) {
          const targetUser = await User.findByPk(memberId)
          await currentRole.addUser(targetUser)
        }
      }
    }

    for (const client of clients) {
      const currentClient = await Client.create({
        id: client._id,
        name: client.name,
        description: client.description,
      })

      const { nested: roles } = client

      if (!_.isEmpty(roles)) {
        for (const roleId of roles) {
          const targetRole = await Role.findByPk(roleId)
          await currentClient.addRole(targetRole)
        }
      }
    }
  }

  return { User, Role, Client }
}

module.exports = createUsersRolesClients
