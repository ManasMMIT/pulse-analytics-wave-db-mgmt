const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const regimenResolvers = require('./regimen')
const sitemapResolvers = require('./sitemap')

module.exports = {
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
  ...regimenResolvers,
}
