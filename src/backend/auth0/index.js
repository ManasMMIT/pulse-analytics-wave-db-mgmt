const authClient = require('./authClient')
const vegaClient = require('./vegaClient')
const UserDao = require('./users')

const users = new UserDao(authClient)

module.exports = {
  users,
  authClient,
  vegaClient,
}
