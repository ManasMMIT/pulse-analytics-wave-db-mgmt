const updateClient = async (
  parent,
  { input: { _id, description } },
  { mongoClient, coreClients, coreRoles, coreUsers, pulseDevDb },
  info
) => {
  const session = mongoClient.startSession()

  let updatedClient

  await session.withTransaction(async () => {
    // ! Ops below used to be put in Promise.all but then during
    // ! testing, transaction breakage was observed with unknown root cause
    // ! Error would say: `MongoError: Given transaction number 1 does not match any in-progress transactions. The active transaction number is -1`

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
