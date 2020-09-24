const people = require('./people')
const DEV_pathwaysInfluencers = require('./DEV_pathwaysInfluencers')
const DEV_providerInfluencers = require('./DEV_providerInfluencers')
const cmsApiResolvers = require('./cms-api')
const personOrganizationConnections = require('./personOrganizationConnections')

module.exports = {
  DEV_pathwaysInfluencers,
  DEV_providerInfluencers,
  people,
  ...cmsApiResolvers,
  personOrganizationConnections,
}
