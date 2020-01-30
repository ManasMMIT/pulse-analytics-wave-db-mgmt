const getCombinedSitemaps = require('./getCombinedSitemaps')

const upsertUserSitemap = async ({
  user,
  session,
  pulseCoreDb,
  pulseDevDb,
}) => {
  const devUsersSitemaps = pulseDevDb.collection('users.sitemaps')
  const coreRoles = pulseCoreDb.collection('roles')

  const userTeams = await coreRoles
    .find(
      { 'users._id': user._id },
      { session }
    )
    .toArray()

  const userTeamsSitemaps = userTeams.map(({ sitemap }) => sitemap)

  const combinedSitemap = getCombinedSitemaps(userTeamsSitemaps)

  const client = userTeams.length
    ? userTeams[0].client
    : null

  const teams = userTeams.length
    ? userTeams.map(({ _id, name }) => ({ _id, name }))
    : []

  await devUsersSitemaps.updateOne(
    { _id: user._id },
    {
      $set: {
        _id: user._id,
        username: user.username,
        sitemap: combinedSitemap,
        teams,
        client,
        schemaVersion: 'v1.2.0',
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { session, upsert: true },
  )

  return true
}

module.exports = upsertUserSitemap
