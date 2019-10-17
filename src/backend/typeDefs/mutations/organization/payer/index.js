const createPayerOrganizationTypeDefs = require('./create')
const updatePayerOrganizationTypeDefs = require('./update')
const deletePayerOrganizationTypeDefs = require('./delete')

module.exports = [
  createPayerOrganizationTypeDefs,
  updatePayerOrganizationTypeDefs,
  deletePayerOrganizationTypeDefs,
]
