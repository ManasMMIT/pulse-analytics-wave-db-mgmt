const _ = require('lodash')
const AuthorizationExtensionClient = require('./AuthorizationExtensionClient')
const {
  auth0_auth_api_clientid,
  auth0_auth_api_secret,
  auth0_auth_api_url,
  auth0_auth_api_issuer,
} = require('./auth0.config.js')

const clientId = auth0_auth_api_clientid
const clientSecret = auth0_auth_api_secret
const url = auth0_auth_api_url
const tokenIssuerUrl = auth0_auth_api_issuer

const authClient = new AuthorizationExtensionClient(
  url,
  { tokenIssuerConfig: { tokenIssuerUrl, clientId, clientSecret } }
)

module.exports = () => Promise.all([
  authClient.getUsers(),
  authClient.getGroups(),
]).then(([
  users,
  groups,
]) => {
  const formattedUsers = users.map(({ user_id: id, name: username }) => ({ id, username }))
  const [roles, clients] = _.partition(groups, groupObj => groupObj.name.includes('-'))
  return { users: formattedUsers, roles, clients }
})
