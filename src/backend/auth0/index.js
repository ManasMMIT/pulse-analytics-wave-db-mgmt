const authClient = require('./authClient')
const UserDao = require('./users')

const users = new UserDao(authClient)

module.exports = {
  users,
  authClient,
}
