const indicationResolvers = require('./indication')
const sitemapResolvers = require('./sitemap')

module.exports = {
  ...indicationResolvers,
  ...sitemapResolvers,
}
