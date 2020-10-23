const Person = require('../Person')
const PersonDeletionEvent = require('./PersonDeletionEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const deletePerson = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient, user }
) => {
  const session = mongoClient.startSession()

  let deletedPerson

  await session.withTransaction(async () => {
    // Step 1: Delete the person
    const person = await Person.init({
      data: input,
      dbs: { pulseCoreDb, pulseDevDb },
    })

    const event = new PersonDeletionEvent(user, person)

    const eventProc = new EventProcessor()

    deletedPerson = await eventProc.process({
      event,
      dbs: { pulseCoreDb },
      session,
    })
  })

  return deletedPerson
}

module.exports = deletePerson
