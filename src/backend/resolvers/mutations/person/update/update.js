const Person = require('../Person')
const PersonRevisionEvent = require('./PersonRevisionEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const updatePerson = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient, user }
) => {
  const session = mongoClient.startSession()

  let updatedPerson

  await session.withTransaction(async () => {
    const person = await Person.init({
      data: input,
      dbs: { pulseCoreDb, pulseDevDb },
    })

    const event = new PersonRevisionEvent(user, person)

    const eventProc = new EventProcessor()

    updatedPerson = await eventProc.process({
      event,
      dbs: { pulseCoreDb, pulseDevDb },
      session,
    })
  })

  return updatedPerson
}

module.exports = updatePerson
