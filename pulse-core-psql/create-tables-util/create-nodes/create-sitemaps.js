const createSitemaps = async Node => {
  const adminSitemap = await Node.create({
    name: 'admin',
    type: 'sitemap',
    order: 1,
  })

  const lillyAdminSitemap = await Node.create({
    name: 'Eli Lilly-admin',
    type: 'sitemap',
    order: 1,
  })

  const regeneronAdminSitemap = await Node.create({
    name: 'Regeneron/Sanofi-admin',
    type: 'sitemap',
    order: 1,
  })

  const sitemaps = {
    adminSitemap,
    lillyAdminSitemap,
    regeneronAdminSitemap,
  }

  return sitemaps
}

module.exports = createSitemaps
