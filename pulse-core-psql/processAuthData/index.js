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

const getAuth0Data = () => Promise.all([
  authClient.getUsers(),
  authClient.getGroups(),
]).then(([
  users,
  groups,
]) => {
  const formattedUsers = users.map(({ user_id: id, name: username }) => ({ id, username }))
  let [roles, clients] = _.partition(groups, groupObj => (
    groupObj.name.includes('-')
    || groupObj._id === "e13031e3-9e3e-4dae-a879-51795babee56" // exception for admin
    || groupObj._id === "25903626-b6c1-49fe-8155-b06787ab0dbb" // exception for demo
  ))

  return { users: formattedUsers, roles, clients }
})

module.exports = getAuth0Data
