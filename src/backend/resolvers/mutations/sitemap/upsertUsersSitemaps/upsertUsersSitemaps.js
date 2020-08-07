const upsertUserSitemap = require('./upsertUserSitemap')

const upsertUsersSitemaps = async ({
  users,
  session,
  pulseCoreDb,
  pulseDevDb,
}) => {
  console.log(`Starting to rebuild sitemaps for ${users.length} user(s)`)

  const userOps = users.map((user) =>
    upsertUserSitemap({
      user,
      session,
      pulseCoreDb,
      pulseDevDb,
    })
  )

  await Promise.all(userOps)

  console.log('Finished rebuilding user(s) sitemap(s)\n')
}

module.exports = upsertUsersSitemaps
