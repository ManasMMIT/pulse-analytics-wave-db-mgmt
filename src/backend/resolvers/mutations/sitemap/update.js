const upsertUsersSitemaps = require('./upsertUsersSitemaps')

const updateRoleSitemap = async (
  parent,
  {
    input: {
      teamId,
      updatedSitemap,
    }
  },
  {
    pulseCoreDb,
    pulseDevDb,
    mongoClient,
  },
  // info
) => {
  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update Team sitemap

    const { value: updatedTeam } = await pulseCoreDb.collection('roles')
      .findOneAndUpdate(
        { _id: teamId },
        { $set: { sitemap: updatedSitemap } },
        { returnOriginal: false, session }
      )

    console.log(`\n${ updatedTeam.name }'s sitemap has been updated`)

    // Step 2: Update users.sitemaps for all team's users

    await upsertUsersSitemaps({
      users: updatedTeam.users,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    result = updatedTeam.sitemap
  })

  return result
}

module.exports = updateRoleSitemap
