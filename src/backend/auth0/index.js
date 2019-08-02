const authClient = require('./authClient')
const ClientDao = require('./clients')
const RoleDao = require('./roles')
const UserDao = require('./users')

const clients = new ClientDao(authClient)
const roles = new RoleDao(authClient)
const users = new UserDao(authClient)

module.exports = {
  clients,
  roles,
  users,
  authClient,
}
