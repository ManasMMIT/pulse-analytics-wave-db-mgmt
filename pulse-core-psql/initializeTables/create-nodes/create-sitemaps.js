const createSitemaps = async Content => {
  const adminSitemap = await Content.create({
    name: 'admin',
    type: 'sitemap',
  })

  const lillyAdminSitemap = await Content.create({
    name: 'Eli Lilly-admin',
    type: 'sitemap',
  })

  const regeneronAdminSitemap = await Content.create({
    name: 'Regeneron/Sanofi-admin',
    type: 'sitemap',
  })

  const sitemaps = {
    adminSitemap,
    lillyAdminSitemap,
    regeneronAdminSitemap,
  }

  return sitemaps
}

module.exports = createSitemaps
