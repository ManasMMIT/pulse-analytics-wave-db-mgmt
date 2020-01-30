const updateClient = async (
  parent,
  { input: { _id, description } },
  {
    mongoClient,
    coreClients,
    coreRoles,
    coreUsers,
    pulseDevDb,
  },
  info,
) => {
  const session = mongoClient.startSession()
  
  let updatedClient

  await session.withTransaction(async () => {
    // Promise.all the updates but here are the parts:
    // - client itself 
    // - teams
    // - users
    // - users.sitemaps

    const clientOp = coreClients.findOneAndUpdate(
      { _id },
      { 
        $set: {
          name: description,
          description,
        } 
      },
      { returnOriginal: false, session },
    )

    const embeddedSetOperation = {
      $set: {
        'client.name': description,
        'client.description': description,
      }
    }

    const rolesOp = coreRoles.updateMany(
      { 'client._id': _id },
      embeddedSetOperation,
      { session },
    )

    const usersOp = coreUsers.updateMany(
      { 'client._id': _id },
      embeddedSetOperation,
      { session },
    )

    const usersSitemapsOp = pulseDevDb.collection('users.sitemaps')
      .updateMany(
        { 'client._id': _id },
        embeddedSetOperation,
        { session },
      )

    const [{ value }] = await Promise.all([
      clientOp,
      rolesOp,
      usersOp,
      usersSitemapsOp,
    ])

    updatedClient = value
  })

  return updatedClient
}

module.exports = updateClient
