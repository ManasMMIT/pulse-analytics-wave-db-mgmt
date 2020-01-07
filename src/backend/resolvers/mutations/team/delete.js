const upsertUsersSitemaps = require('../sitemap/sitemaps-upsertion/upsertUsersSitemaps')
const upsertUsersPermissions = require('../sitemap/permissions-upsertion/upsertUsersPermissions')

const deleteTeam = async (
  parent,
  { input: { _id, clientId } },
  {
    mongoClient,
    pulseCoreDb,
    pulseDevDb,
  },
  // info
) => {
  if (!Boolean(clientId)) {
    throw Error('must specify clientId')
  }

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete Team
    
    const {
      value: deletedTeam
    } = await pulseCoreDb
      .collection('roles')
      .findOneAndDelete({ _id }, { session })
  
    console.log(`${ deletedTeam.name } was successfully deleted`)
    
    // Step 2a: Regen all team users sitemaps
    // Step 2b: Regen all team users resources
    
    await Promise.all([
      upsertUsersSitemaps({
        users: deletedTeam.users,
        session,
        pulseCoreDb,
        pulseDevDb,
      }),
      upsertUsersPermissions({
        users: deletedTeam.users,
        pulseCoreDb,
        pulseDevDb,
        session,
      })
    ])

    result = deletedTeam
  })

  return result
}

module.exports = deleteTeam
