const PathwaysAndPersonConnection = require('./PathwaysAndPersonConnection')
const PathwaysAndPersonConnectionDeletionEvent = require('./PathwaysAndPersonConnectionDeletionEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const deletePathwaysAndPersonConnection = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient, user }
) => {
  const session = mongoClient.startSession()

  let deletedConnection

  await session.withTransaction(async () => {
    const connection = await PathwaysAndPersonConnection.init({
      data: input,
      dbs: { pulseCoreDb, pulseDevDb },
    })

    const event = new PathwaysAndPersonConnectionDeletionEvent(user, connection)

    const eventProc = new EventProcessor()

    deletedConnection = await eventProc.process({
      event,
      dbs: { pulseCoreDb },
      session,
    })
  })

  return deletedConnection
}

module.exports = deletePathwaysAndPersonConnection
