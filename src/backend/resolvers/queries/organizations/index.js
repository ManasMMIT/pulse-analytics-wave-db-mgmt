const providerOrganizations = require('./providers')
const payerOrganizations = require('./payers')
const pathwaysResolvers = require('./pathways')
const apmOrganizations = require('./apm')
const obmResolvers = require('./obm')
const organizationMeta = require('./meta')

module.exports = {
  providerOrganizations,
  payerOrganizations,
  ...pathwaysResolvers,
  apmOrganizations,
  ...obmResolvers,
  organizationMeta,
}
