const providerOrganizationResolvers = require('./provider')
const payerOrganizationResolvers = require('./payer')
const pathwaysOrganizationResolvers = require('./pathways')
const apmOrganizationResolvers = require('./apm')
const mbmOrganizationResolvers = require('./mbm')
const metaResolvers = require('./meta')

module.exports = {
  ...metaResolvers,
  ...providerOrganizationResolvers,
  ...payerOrganizationResolvers,
  ...pathwaysOrganizationResolvers,
  ...apmOrganizationResolvers,
  ...mbmOrganizationResolvers,
}
