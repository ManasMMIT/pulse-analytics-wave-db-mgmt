const _ = require('lodash')
const { ObjectId } = require('mongodb')
const { zonedTimeToUtc } = require('date-fns-tz')
const DEFAULT_TIMEZONE = require('../../../../../../../utils/defaultTimeZone')

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many key events
const connectObmAndKeyEvent = async (
  parent,
  { input: { obmId, keyEvents } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  obmId = ObjectId(obmId)

  const session = mongoClient.startSession()

  const docsToInsert = keyEvents.map(
    ({ _id, date, title, description, link, internalTdgNote }) => ({
      _id: _id ? ObjectId(_id) : ObjectId(),
      obmId,
      date: date && zonedTimeToUtc(date, DEFAULT_TIMEZONE),
      title,
      description,
      link,
      internalTdgNote,
    })
  )

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given obm
    // with the incoming key events
    await pulseCoreDb
      .collection('obms.keyEvents')
      .deleteMany({ obmId }, { session })

    if (!_.isEmpty(docsToInsert)) {
      await pulseCoreDb
        .collection('obms.keyEvents')
        .insertMany(docsToInsert, { session })
    }

    // Step 2: replace all existing entries affiliated with given obm
    // with the incoming entries in dev obmsKeyEvents
    await pulseDevDb
      .collection('obmsKeyEvents')
      .deleteMany({ obmId }, { session })

    if (!_.isEmpty(docsToInsert)) {
      await pulseDevDb
        .collection('obmsKeyEvents')
        .insertMany(docsToInsert, { session })
    }
  })

  return docsToInsert
}

module.exports = connectObmAndKeyEvent
