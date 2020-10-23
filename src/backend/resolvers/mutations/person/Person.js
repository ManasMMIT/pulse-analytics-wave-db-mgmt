const INIT_PERSON_SYMBOL = Symbol('INIT_PERSON_SYMBOL')
const { ObjectId } = require('mongodb')

const BusinessObject = require('../shared/BusinessObject')

const EventProcessor = require('../shared/Event/EventProcessor')
const PathwaysAndPersonConnection = require('../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnection')
const PathwaysAndPersonConnectionDeletionEvent = require('../relationalResolvers/pathwaysAndPerson/PathwaysAndPersonConnectionDeletionEvent')

const PERSON_BUSINESS_OBJECT_ID = ObjectId('5eea22d5adbf920fa4320487')
const SOURCE_COLLECTION = 'people'

// factory pattern: https://qwtel.com/posts/software/async-constructor-pattern/#factory-functions
class Person {
  static async init({ data, dbs }) {
    const person = new Person(INIT_PERSON_SYMBOL)

    const businessObject = await dbs.pulseCoreDb
      .collection('businessObjects')
      .findOne({ _id: PERSON_BUSINESS_OBJECT_ID })

    person.businessObject = {
      _id: PERSON_BUSINESS_OBJECT_ID,
      name: businessObject.name,
    }

    person.data = {
      // ! incoming data is splatted in like this because I'm worried
      // ! the class won't be able to keep up with the changing fields on Person
      ...data,
      _id: data._id ? ObjectId(data._id) : ObjectId(),
    }

    person.dbs = dbs

    const prevData = await person.getPrevData()
    person.prevData = prevData || {}

    person.fieldMap = await BusinessObject.getFieldMap({
      db: dbs.pulseCoreDb,
      boId: PERSON_BUSINESS_OBJECT_ID,
    })

    return person
  }

  constructor(token) {
    if (token !== INIT_PERSON_SYMBOL) {
      throw new Error(
        `Can't initialize Person via constructor; use Person.init instead`
      )
    }
  }

  getPrevData() {
    return this.dbs.pulseCoreDb
      .collection(SOURCE_COLLECTION)
      .findOne({ _id: this.data._id })
  }

  create(session, timestamp) {
    return this.dbs.pulseCoreDb
      .collection(SOURCE_COLLECTION)
      .insertOne(
        {
          ...this.data,
          createdOn: timestamp,
          updatedOn: timestamp,
        },
        { session }
      )
      .then(({ ops }) => ops[0])
  }

  async update(session, timestamp) {
    const { pulseCoreDb, pulseDevDb } = this.dbs
    const { _id, ...setData } = this.data

    // Step 1: Update core person
    const updatedPerson = await pulseCoreDb
      .collection(SOURCE_COLLECTION)
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            ...setData,
            updatedOn: timestamp,
          },
        },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Cascade update pulse-dev.obmsInfluencers
    await pulseDevDb.collection('obmsInfluencers').updateMany(
      { 'person._id': updatedPerson._id },
      {
        $set: {
          'person.firstName': updatedPerson.firstName,
          'person.lastName': updatedPerson.lastName,
          'person.nationalProviderIdentifier':
            updatedPerson.nationalProviderIdentifier,
        },
      },
      { session }
    )

    let member = updatedPerson.firstName
    if (updatedPerson.middleName) member += ` ${updatedPerson.middleName}`
    if (updatedPerson.lastName) member += ` ${updatedPerson.lastName}`

    // Step 3: Cascade update TEMP_pathwaysInfluencers collection (soon to be pathwaysInfluencers) in pulse-dev
    await pulseDevDb.collection('TEMP_pathwaysInfluencers').updateMany(
      { personId: updatedPerson._id },
      {
        $set: {
          member,
          affiliation: updatedPerson.affiliation,
          affiliationPosition: updatedPerson.affiliationPosition,
          primaryState: updatedPerson.primaryState,
          npiNumber: String(updatedPerson.nationalProviderIdentifier),
          updatedOn: new Date(),
        },
      },
      { session }
    )

    return updatedPerson
  }

  async delete(session, timestamp, userData) {
    const { pulseCoreDb, pulseDevDb } = this.dbs
    const { _id } = this.data
    // Step 1: Delete person from own collection
    const { value: deletedPerson } = await pulseCoreDb
      .collection(SOURCE_COLLECTION)
      .findOneAndDelete({ _id }, { session })

    // Step 2: Cascade delete person if an obm influencer
    await pulseCoreDb
      .collection('JOIN_obms_people')
      .deleteMany({ personId: _id }, { session })

    // Step 3: Cascade delete JOIN entries connected to person in pulse-dev.obmsInfluencers
    await pulseDevDb
      .collection('obmsInfluencers')
      .deleteMany({ 'person._id': _id }, { session })

    // Step 4: Delete all pathways/people connections touching that person, core and dev
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
        userData,
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

    return deletedPerson
  }
}

module.exports = Person
