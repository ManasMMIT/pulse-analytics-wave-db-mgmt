const providerOrganizations = require('./providers')
const payerOrganizations = require('./payers')
const pathwaysResolvers = require('./pathways')
const apmOrganizations = require('./apm')
const mbmResolvers = require('./mbm')
const organizationMeta = require('./meta')
const organizationTypes = require('./organizationTypes')

module.exports = {
  providerOrganizations,
  payerOrganizations,
  ...pathwaysResolvers,
  apmOrganizations,
  ...mbmResolvers,
  organizationMeta,
  organizationTypes,
}
