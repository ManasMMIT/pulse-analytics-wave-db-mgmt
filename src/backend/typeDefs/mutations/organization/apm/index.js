const createApmOrganizationTypeDefs = require('./create')
const updateApmOrganizationTypeDefs = require('./update')
const deleteApmOrganizationTypeDefs = require('./delete')

module.exports = [
  createApmOrganizationTypeDefs,
  updateApmOrganizationTypeDefs,
  deleteApmOrganizationTypeDefs,
]
