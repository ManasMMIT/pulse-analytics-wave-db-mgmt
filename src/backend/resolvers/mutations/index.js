const indicationResolvers = require('./indication')
const productResolvers = require('./product')
const sitemapResolvers = require('./sitemap')

module.exports = {
  ...indicationResolvers,
  ...productResolvers,
  ...sitemapResolvers,
}
