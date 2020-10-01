const people = require('./people')
const DEV_pathwaysInfluencers = require('./DEV_pathwaysInfluencers')
const DEV_providerInfluencers = require('./DEV_providerInfluencers')
const cmsApiResolvers = require('./cms-api')

module.exports = {
  DEV_pathwaysInfluencers,
  DEV_providerInfluencers,
  people,
  ...cmsApiResolvers,
}
