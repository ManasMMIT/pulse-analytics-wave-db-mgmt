const { ObjectId } = require('mongodb')
const { zonedTimeToUtc } = require('date-fns-tz')

const DEFAULT_TIMEZONE = require('../../../../utils/defaultTimeZone')
const BusinessObject = require('../../shared/BusinessObject')

const INIT_PATHWAYS_AND_PERSON_CONNECTION_SYMBOL = Symbol(
  'INIT_PATHWAYS_AND_PERSON_CONNECTION_SYMBOL'
)
const SOURCE_COLLECTION = 'JOIN_pathways_people'

const PATHWAYS_BOID = ObjectId('5eac3251ac8a01743081f28d')
const PERSON_BOID = ObjectId('5eea22d5adbf920fa4320487')
const PATHWAYS_PERSON_WIDGET_ID = ObjectId('5f7b8ed2f0300b312990adf7')

// factory pattern: https://qwtel.com/posts/software/async-constructor-pattern/#factory-functions
class PathwaysAndPersonConnection {
  static async init({ data, dbs }) {
    const connection = new PathwaysAndPersonConnection(
      INIT_PATHWAYS_AND_PERSON_CONNECTION_SYMBOL
    )

    connection.businessObject = null

    connection.data = {
      // ! incoming data is splatted in like this because I'm worried
      // ! the class won't be able to keep up with changing fields
      ...data,
      internalFields: {
        ...data.internalFields,
        valueChairsIndicationIds: data.internalFields.valueChairsIndicationIds.map(
          ObjectId
        ),
      },
      alert: {
        ...data.alert,
        date:
          data.alert.date && zonedTimeToUtc(data.alert.date, DEFAULT_TIMEZONE),
      },
      _id: data._id ? ObjectId(data._id) : ObjectId(),
      personId: ObjectId(data.personId),
      pathwaysId: ObjectId(data.pathwaysId),
      indicationIds: data.indicationIds.map(ObjectId),
      startDate:
        data.startDate && zonedTimeToUtc(data.startDate, DEFAULT_TIMEZONE),
      endDate: data.endDate && zonedTimeToUtc(data.endDate, DEFAULT_TIMEZONE),
    }

    connection.dbs = dbs

    const prevData = await connection.getPrevData()
    connection.prevData = prevData || {}

    connection.relationalFieldMap = await BusinessObject.getRelationalFieldMap({
      db: dbs.pulseCoreDb,
      widgetId: PATHWAYS_PERSON_WIDGET_ID,
    })

    // take a snapshot of "next" connected entities, which will be stored
    // top-level on the event itself
    connection.connectedEntities = await connection.getConnectedEntities()

    return connection
  }

  constructor(token) {
    if (token !== INIT_PATHWAYS_AND_PERSON_CONNECTION_SYMBOL) {
      throw new Error(
        `Can't initialize PathwaysAndPersonConnection via constructor; use PathwaysAndPersonConnection.init instead`
      )
    }
  }

  getPrevData() {
    return this.dbs.pulseCoreDb
      .collection(SOURCE_COLLECTION)
      .findOne({ _id: this.data._id })
  }

  async getConnectedEntities() {
    const {
      data: { personId, pathwaysId },
      dbs: { pulseCoreDb },
    } = this

    const getEntity = (boId, entityId) => {
      return pulseCoreDb
        .collection('businessObjects')
        .findOne({ _id: boId })
        .then(({ sourceCollection: { collection, query = {} } }) =>
          pulseCoreDb
            .collection(collection)
            .findOne({ ...query, _id: entityId })
        )
    }

    const [personEntity, pathwaysEntity] = await Promise.all([
      getEntity(PERSON_BOID, personId),
      getEntity(PATHWAYS_BOID, pathwaysId),
    ])

    return [
      { ...personEntity, boId: PERSON_BOID },
      { ...pathwaysEntity, boId: PATHWAYS_BOID },
    ]
  }

  async create(session, timestamp) {
    const { pulseCoreDb, pulseDevDb } = this.dbs

    // Step 1: Create the connection in core
    const createdConnection = await pulseCoreDb
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

    // TODO: Step 2: Materialize the connection in dev
    // MATERIALIZATION OP

    return createdConnection
  }

  async update(session, timestamp) {
    const { pulseCoreDb, pulseDevDb } = this.dbs
    const { _id, ...setData } = this.data

    // Step 1: Update the connection in core
    const updatedConnection = await pulseCoreDb
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

    // TODO: Step 2: Update the materialized version of the connection
    // in pulse-dev

    return updatedConnection
  }

  async delete(session, timestamp) {
    const { pulseCoreDb, pulseDevDb } = this.dbs
    const { _id } = this.data

    // Step 1: Delete the connection in core
    const { value: deletedConnection } = await pulseCoreDb
      .collection(SOURCE_COLLECTION)
      .findOneAndDelete({ _id }, { session })

    // TODO: Step 2: Cascade delete JOIN entries in pulse-dev.pathwaysInfluencers
    // MATERIALIZATION OP

    return deletedConnection
  }
}

module.exports = PathwaysAndPersonConnection
