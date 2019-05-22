const createSitemaps = async Node => {
  const adminSitemap = await Node.create({
    name: 'admin',
    type: 'sitemap',
  })

  const lillyAdminSitemap = await Node.create({
    name: 'Eli Lilly-admin',
    type: 'sitemap',
  })

  const regeneronAdminSitemap = await Node.create({
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
