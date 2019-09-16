const clientResolvers = require('./client')
const teamResolvers = require('./team')
const userResolvers = require('./user')
const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const regimenResolvers = require('./regimen')
const sitemapResolvers = require('./sitemap')
const qualityAccessScoreResolvers = require('./qualityAccessScore')

module.exports = {
  ...clientResolvers,
  ...teamResolvers,
  ...userResolvers,
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
  ...regimenResolvers,
  ...qualityAccessScoreResolvers,
}
