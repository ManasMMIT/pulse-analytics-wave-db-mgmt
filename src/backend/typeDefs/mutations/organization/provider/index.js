const createProviderOrganizationTypeDefs = require('./create')
const updateProviderOrganizationTypeDefs = require('./update')
const deleteProviderOrganizationTypeDefs = require('./delete')

module.exports = [
  createProviderOrganizationTypeDefs,
  updateProviderOrganizationTypeDefs,
  deleteProviderOrganizationTypeDefs,
]
