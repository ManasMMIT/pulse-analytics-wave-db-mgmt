const Person = require('../Person')
const PersonCreationEvent = require('./PersonCreationEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const createPerson = async (
  parent,
  { input },
  { pulseCoreDb, mongoClient, user }
) => {
  const session = mongoClient.startSession()

  let createdPerson

  await session.withTransaction(async () => {
    const person = await Person.init({
      data: input,
      dbs: { pulseCoreDb },
    })

    const event = new PersonCreationEvent(user, person)

    const eventProc = new EventProcessor()

    createdPerson = await eventProc.process({
      event,
      dbs: { pulseCoreDb },
      session,
    })
  })

  return createdPerson
}

module.exports = createPerson
