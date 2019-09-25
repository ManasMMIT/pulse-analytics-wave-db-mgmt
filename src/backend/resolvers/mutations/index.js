const clientResolvers = require('./client')
const teamResolvers = require('./team')
const userResolvers = require('./user')
const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const regimenResolvers = require('./regimen')
const accountResolvers = require('./account')
const sitemapResolvers = require('./sitemap')
const qualityOfAccessScoreResolvers = require('./qualityOfAccessScore')
const collectionResolvers = require('./collection')
const alertResolvers = require('./alert')

module.exports = {
  ...clientResolvers,
  ...teamResolvers,
  ...userResolvers,
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
  ...regimenResolvers,
  ...accountResolvers,
  ...qualityOfAccessScoreResolvers,
  ...collectionResolvers,
  ...alertResolvers,
}
