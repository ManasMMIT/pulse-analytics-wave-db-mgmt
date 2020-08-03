const { ROLE_D, ROLE_E } = require('../input/roles')

module.exports = {
  tools: ROLE_D.sitemap.tools.concat(ROLE_E.sitemap.tools),
  dashboards: ROLE_D.sitemap.dashboards.concat(ROLE_E.sitemap.dashboards),
  pages: ROLE_D.sitemap.pages.concat(ROLE_E.sitemap.pages),
  cards: ROLE_D.sitemap.cards.concat(ROLE_E.sitemap.cards),
}
