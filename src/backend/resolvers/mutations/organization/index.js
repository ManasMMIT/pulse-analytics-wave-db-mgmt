const providerOrganizationResolvers = require('./provider')
const payerOrganizationResolvers = require('./payer')
const pathwaysOrganizationResolvers = require('./pathways')
const apmOrganizationResolvers = require('./apm')

module.exports = {
  ...providerOrganizationResolvers,
  ...payerOrganizationResolvers,
  ...pathwaysOrganizationResolvers,
  ...apmOrganizationResolvers,
}
