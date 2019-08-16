const initializeUsersRolesClients = sequelize => {
  const Client = sequelize.import('client', require('./models/client'))
  const ClientRole = sequelize.import('clients_roles', require('./models/clients_roles'))
  const Role = sequelize.import('role', require('./models/role'))
  const UserRole = sequelize.import('users_roles', require('./models/users_roles'))
  const User = sequelize.import('user', require('./models/user'))

  User.belongsToMany(Role, { through: UserRole })
  Role.belongsToMany(User, { through: UserRole })

  Client.belongsToMany(Role, { through: ClientRole })
  Role.belongsToMany(Client, { through: ClientRole })

  return { User, Role, Client }
}

module.exports = initializeUsersRolesClients
