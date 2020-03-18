require('dotenv').config()

const {
  auth0_mgmt_api_clientid,
  auth0_mgmt_api_secret,
  auth0_mgmt_api_url,
  auth0_mgmt_api_audience,
} = process.env

const ManagementClient = require('./ManagementClient')

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
  getUser: authMgmtClient.getUser.bind(authMgmtClient),
  getUsers: authMgmtClient.getUsers.bind(authMgmtClient),
  createUser: authMgmtClient.createUser.bind(authMgmtClient),
  deleteUser: authMgmtClient.deleteUser.bind(authMgmtClient),
  updateUser: authMgmtClient.updateUser.bind(authMgmtClient),
}
