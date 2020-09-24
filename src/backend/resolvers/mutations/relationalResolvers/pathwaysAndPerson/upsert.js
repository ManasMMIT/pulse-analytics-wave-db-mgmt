const PathwaysAndPersonConnection = require('./PathwaysAndPersonConnection')
const PathwaysAndPersonConnectionUpsertionEvent = require('./PathwaysAndPersonConnectionUpsertionEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const upsertPathwaysAndPersonConnection = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient, user }
) => {
  const session = mongoClient.startSession()

  let upsertedConnection

  await session.withTransaction(async () => {
    const connection = await PathwaysAndPersonConnection.init({
      data: input,
      dbs: { pulseCoreDb, pulseDevDb },
    })

    const event = new PathwaysAndPersonConnectionUpsertionEvent(
      user,
      connection
    )

    const eventProc = new EventProcessor()

    upsertedConnection = await eventProc.process({
      event,
      dbs: { pulseCoreDb },
      session,
    })
  })

  return upsertedConnection
}

module.exports = upsertPathwaysAndPersonConnection
