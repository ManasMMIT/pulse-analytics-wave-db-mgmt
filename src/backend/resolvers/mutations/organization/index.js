const providerOrganizationResolvers = require('./provider')
const payerOrganizationResolvers = require('./payer')
const pathwaysOrganizationResolvers = require('./pathways')
const apmOrganizationResolvers = require('./apm')
const obmOrganizationResolvers = require('./obm')
const metaResolvers = require('./meta')

module.exports = {
  ...metaResolvers,
  ...providerOrganizationResolvers,
  ...payerOrganizationResolvers,
  ...pathwaysOrganizationResolvers,
  ...apmOrganizationResolvers,
  ...obmOrganizationResolvers,
}
