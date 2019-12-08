const providerOrganizationResolvers = require('./provider')
const payerOrganizationResolvers = require('./payer')
const pathwaysOrganizationResolvers = require('./pathways')
const apmOrganizationResolvers = require('./apm')

const connectionResolvers = require('./connections')

module.exports = {
  ...providerOrganizationResolvers,
  ...payerOrganizationResolvers,
  ...pathwaysOrganizationResolvers,
  ...apmOrganizationResolvers,
  ...connectionResolvers,
}
