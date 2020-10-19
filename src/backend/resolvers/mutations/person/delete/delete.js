const Person = require('../Person')
const PersonDeletionEvent = require('./PersonDeletionEvent')
const EventProcessor = require('../../shared/Event/EventProcessor')

const PathwaysAndPersonConnection = require('../../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnection')
const PathwaysAndPersonConnectionDeletionEvent = require('../../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnectionDeletionEvent')

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

    // Step 2: Delete all connections touching that person, core and dev
    const connectionsToDelete = await pulseCoreDb
      .collection('JOIN_pathways_people')
      .find({ personId: deletedPerson._id })
      .toArray()

    const deletionOps = connectionsToDelete.map(async (connectionToDelete) => {
      const connection = await PathwaysAndPersonConnection.init({
        data: connectionToDelete,
        dbs: { pulseCoreDb, pulseDevDb },
      })

      const event = new PathwaysAndPersonConnectionDeletionEvent(
        user,
        connection
      )

      const eventProc = new EventProcessor()

      await eventProc.process({
        event,
        dbs: { pulseCoreDb },
        session,
      })
    })

    await Promise.all(deletionOps)

    await pulseDevDb
      .collection('TEMP_pathwaysInfluencers')
      .deleteMany({ personId: deletedPerson._id }, { session })
  })

  return deletedPerson
}

module.exports = deletePerson
