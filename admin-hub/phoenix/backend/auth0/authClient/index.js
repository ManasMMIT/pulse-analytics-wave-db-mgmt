require('dotenv').load()

const {
  auth0_auth_api_clientid,
  auth0_auth_api_secret,
  auth0_auth_api_url,
  auth0_auth_api_issuer,
  auth0_mgmt_api_clientid,
  auth0_mgmt_api_secret,
  auth0_mgmt_api_url,
  auth0_mgmt_api_audience,
} = process.env

const AuthorizationExtensionClient = require('./AuthorizationExtensionClient')
const ManagementClient = require('./ManagementClient')

const authExtClient = new AuthorizationExtensionClient(
  auth0_auth_api_url,
  {
    tokenIssuerConfig: {
      tokenIssuerUrl: auth0_auth_api_issuer,
      clientId: auth0_auth_api_clientid,
      clientSecret: auth0_auth_api_secret,
    }
  }
)

const authMgmtClient = new ManagementClient(
  auth0_mgmt_api_url,
  {
    tokenIssuerConfig: {
      audience: auth0_mgmt_api_audience,
      clientId: auth0_mgmt_api_clientid,
      clientSecret: auth0_mgmt_api_secret,
    }
  }
)

module.exports = {
  addGroupRole: authExtClient.addGroupRole.bind(authExtClient),
  addGroupRoles: authExtClient.addGroupRoles.bind(authExtClient),
  addGroupMember: authExtClient.addGroupMember.bind(authExtClient),
  addGroupMembers: authExtClient.addGroupMembers.bind(authExtClient),
  addNestedGroup: authExtClient.addNestedGroup.bind(authExtClient),
  addNestedGroups: authExtClient.addNestedGroups.bind(authExtClient),
  getUser: authExtClient.getUser.bind(authExtClient),
  getRole: authExtClient.getRole.bind(authExtClient),
  getRoles: authExtClient.getRoles.bind(authExtClient),
  getGroups: authExtClient.getGroups.bind(authExtClient),
  getPermissions: authExtClient.getPermissions.bind(authExtClient),
  getUserGroups: authExtClient.getUserGroups.bind(authExtClient),
  createGroup: authExtClient.createGroup.bind(authExtClient),
  createPermission: authExtClient.createPermission.bind(authExtClient),
  createRole: authExtClient.createRole.bind(authExtClient),
  updateRole: authExtClient.updateRole.bind(authExtClient),
  removeNestedGroup: authExtClient.removeNestedGroup.bind(authExtClient),
  removeGroup: authExtClient.removeGroup.bind(authExtClient),
  removeRole: authExtClient.removeRole.bind(authExtClient),
  removeGroupMember: authExtClient.removeGroupMember.bind(authExtClient),
  removeGroupMembers: authExtClient.removeGroupMembers.bind(authExtClient),
  updateGroup: authExtClient.updateGroup.bind(authExtClient),
  getUsers: authMgmtClient.getUsers.bind(authMgmtClient),
  createUser: authMgmtClient.createUser.bind(authMgmtClient),
  deleteUser: authMgmtClient.deleteUser.bind(authMgmtClient),
  updateUser: authMgmtClient.updateUser.bind(authMgmtClient),
}
