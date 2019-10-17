const clientResolvers = require('./client')
const teamResolvers = require('./team')
const userResolvers = require('./user')
const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const regimenResolvers = require('./regimen')
const organizationResolvers = require('./organization')
const sitemapResolvers = require('./sitemap')
const qualityOfAccessScoreResolvers = require('./qualityOfAccessScore')
const collectionResolvers = require('./collection')
const alertResolvers = require('./alert')
const treatmentPlan = require('./treatmentPlan')
const resourceResolvers = require('./resource')

module.exports = {
  ...clientResolvers,
  ...teamResolvers,
  ...userResolvers,
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
  ...regimenResolvers,
  ...qualityOfAccessScoreResolvers,
  ...collectionResolvers,
  ...alertResolvers,
  ...treatmentPlan,
  ...organizationResolvers,
  ...resourceResolvers,
}
