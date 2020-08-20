const updateOp = require('./updateOp')

const updateClient = async (
  parent,
  { input },
  { mongoClient, coreClients, coreRoles, coreUsers, pulseDevDb },
  info
) => {
  const session = mongoClient.startSession()

  const updatedClient = await session.withTransaction(async () => {
    await updateOp({
      session,
      coreClients,
      coreRoles,
      coreUsers,
      pulseDevDb,
      input,
    })
  })

  return updatedClient
}

module.exports = updateClient
