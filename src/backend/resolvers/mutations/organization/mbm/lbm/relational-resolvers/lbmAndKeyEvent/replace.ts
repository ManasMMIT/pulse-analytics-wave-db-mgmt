import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { zonedTimeToUtc } from 'date-fns-tz'
import DEFAULT_TIMEZONE from '../../../../../../../utils/defaultTimeZone'

// ! ASSUMPTION: this resolver is for connecting a SINGLE LBM to many key events
const connectLbmAndKeyEvent = async (
  parent,
  { input: { lbmId, keyEvents } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  lbmId = new ObjectId(lbmId)

  const session = mongoClient.startSession()

  const docsToInsert = keyEvents.map(
    ({ _id, date, title, description, link, internalTdgNote }) => ({
      _id: _id ? new ObjectId(_id) : new ObjectId(),
      lbmId,
      date: date && zonedTimeToUtc(date, DEFAULT_TIMEZONE),
      title,
      description,
      link,
      internalTdgNote,
    })
  )

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given lbm
    // with the incoming key events
    await pulseCoreDb
      .collection('lbms.keyEvents')
      .deleteMany({ lbmId }, { session })

    if (!isEmpty(docsToInsert)) {
      await pulseCoreDb
        .collection('lbms.keyEvents')
        .insertMany(docsToInsert, { session })
    }

    // Step 2: replace all existing entries affiliated with given lbm
    // with the incoming entries in dev lbmsKeyEvents
    await pulseDevDb
      .collection('lbmsKeyEvents')
      .deleteMany({ lbmId }, { session })

    if (!isEmpty(docsToInsert)) {
      await pulseDevDb
        .collection('lbmsKeyEvents')
        .insertMany(docsToInsert, { session })
    }
  })

  return docsToInsert
}

export default connectLbmAndKeyEvent
