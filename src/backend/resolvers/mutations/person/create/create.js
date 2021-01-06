const Person = require('../Person')
const PersonCreationEvent = require('./PersonCreationEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')
const checkForDupePerson = require('./checkForDupePerson')

const createPerson = async (
  parent,
  { input },
  { pulseCoreDb, mongoClient, user }
) => {
  // Check for dupes unless skipDupeCheck is true; if dupe suspected, throw error
  const { skipDupeCheck } = input

  if (!skipDupeCheck) {
    await checkForDupePerson({ personData: input, pulseCoreDb })
  }

  delete input['skipDupeCheck']

  // Create the person with event logging
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
