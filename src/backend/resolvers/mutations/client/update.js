const updateClient = async (
  parent,
  { input: { _id, description } },
  { mongoClient, coreClients, coreRoles, coreUsers, pulseDevDb },
  info
) => {
  const session = mongoClient.startSession()

  let updatedClient

  await session.withTransaction(async () => {
    // Promise.all the updates but here are the parts:
    // - client itself
    // - teams
    // - users
    // - users.sitemaps

    const { value } = await coreClients.findOneAndUpdate(
      { _id },
      {
        $set: {
          name: description,
          description,
        },
      },
      { returnOriginal: false, session }
    )

    const embeddedSetOperation = {
      $set: {
        'client.name': description,
        'client.description': description,
      },
    }

    await coreRoles.updateMany({ 'client._id': _id }, embeddedSetOperation, {
      session,
    })

    await coreUsers.updateMany({ 'client._id': _id }, embeddedSetOperation, {
      session,
    })

    await pulseDevDb
      .collection('users.sitemaps')
      .updateMany({ 'client._id': _id }, embeddedSetOperation, { session })

    updatedClient = value
  })

  return updatedClient
}

module.exports = updateClient
