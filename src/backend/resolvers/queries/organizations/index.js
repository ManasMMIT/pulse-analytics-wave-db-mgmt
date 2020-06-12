const providerOrganizations = require('./providers')
const payerOrganizations = require('./payers')
const pathwaysOrganizations = require('./pathways')
const apmOrganizations = require('./apm')
const obmResolvers = require('./obm')
const organizationMeta = require('./meta')

module.exports = {
  providerOrganizations,
  payerOrganizations,
  pathwaysOrganizations,
  apmOrganizations,
  ...obmResolvers,
  organizationMeta,
}
