const wait = require('./../../../utils/wait')

const deleteClient = async (
  parent,
  { input: { _id } },
  {
    mongoClient,
    coreClients,
    coreRoles,
    coreUsers,
    pulseDevDb,
    auth0,
  },
  info
) => {
  const session = mongoClient.startSession()

  let client
  await session.withTransaction(async () => {
    client = await coreClients.findOne({ _id }, { session })

    /*
      Remove all client-related data:
        1. client roles
        2. client users
        3. client users sitemaps
        4. client users permissions
    */

    // ! need userIds to properly delete users' sitemaps/resources
    // ! without relying on client data in dev collections
    const clientUsers = await coreUsers
      .find({ 'client._id': _id }, { session })
      .toArray()

    const clientUserIds = clientUsers.map(({ _id }) => _id)

    const deleteUserSitemapsOp = pulseDevDb.collection('users.sitemaps')
      .deleteMany(
        { _id: { $in: clientUserIds } },
        { session }
      )

    const deleteUserResourcesOp = pulseDevDb.collection('users.nodes.resources')
      .deleteMany(
        { _id: { $in: clientUserIds } },
        { session }
      )

    const deleteTeamsOp = coreRoles.deleteMany({ 'client._id': _id }, { session })
    const deleteUsersOp = coreUsers.deleteMany({ 'client._id': _id }, { session })

    await Promise.all([
      deleteTeamsOp,
      deleteUsersOp,
      deleteUserSitemapsOp,
      deleteUserResourcesOp,
    ])

    // Finally delete client
    await coreClients.deleteOne({ _id }, { session })

    console.log('Beginning removal of affiliated users in auth0...')
    // ! Remove all client's users from auth0.
    // ! (We don't care about clients and teams in auth0 ext because we've removed auth0 ext from our permissions system.)
    // ! Errors thrown in this section will revert the entire transaction.
    for (const userId of clientUserIds) {
      try {
        await auth0.users.delete(userId)
        console.log('User', userId, 'deleted from Auth0')
      } catch (e) {
        throw Error(`Deletion failed for user ID ${userId}: ${e}`)
      }

      await wait() // ! needed due to auth0 rate limits
    }
  })

  console.log(`Successfully deleted client ${client.description} and connected roles and users`)

  return client
}

module.exports = deleteClient
