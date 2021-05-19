const axios = require('axios')
const { ObjectId } = require('mongodb')

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
    // ! Vega Op
    const { uuid } = await pulseCoreDb
      .collection('people')
      .findOne({ _id: ObjectId(input._id) })
    if (uuid) {
      await axios
        .patch(`people/${uuid}/`, {
          first_name: input.firstName,
          last_name: input.lastName,
          middle_name: input.middleName,
        })
        .catch((e) => {
          throw new Error(JSON.stringify(e.response.data))
        })
    }

    // ! Mongo Ops
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
