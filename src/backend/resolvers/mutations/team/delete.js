const upsertUsersSitemaps = require('../sitemap/upsertUsersSitemaps')
const upsertUsersPermissions = require('../../../generate-users-permissions/upsertUsersPermissions')

const deleteTeam = async (
  parent,
  { input: { _id, clientId } },
  {
    mongoClient,
    pulseCoreDb,
    pulseDevDb,
    auth0,
  },
  // info
) => {
  if (!Boolean(clientId)) {
    throw Error('must specify clientId')
  }

  // ! auth0
  await auth0.roles.delete({ id: _id, clientId })

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
