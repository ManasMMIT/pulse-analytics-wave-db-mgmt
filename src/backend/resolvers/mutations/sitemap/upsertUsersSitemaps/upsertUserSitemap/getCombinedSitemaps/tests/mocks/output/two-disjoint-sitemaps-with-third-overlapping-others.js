const { ROLE_A, ROLE_B } = require('../../../../mocksInput/roles')

module.exports = {
  tools: ROLE_A.sitemap.tools.concat(ROLE_B.sitemap.tools),
  dashboards: ROLE_A.sitemap.dashboards.concat(ROLE_B.sitemap.dashboards),
  pages: ROLE_A.sitemap.pages.concat(ROLE_B.sitemap.pages),
  cards: ROLE_A.sitemap.cards.concat(ROLE_B.sitemap.cards),
}
