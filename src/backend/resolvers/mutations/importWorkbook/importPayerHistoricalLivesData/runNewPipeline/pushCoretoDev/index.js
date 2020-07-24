const _ = require('lodash')
const materializeNationalLives = require('./materializeNationalLives')
const materializeStateLives = require('./materializeStateLives')

const pushCoreToDev = async ({
  incomingTimestamp,
  territoryType,
  source,
  dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
  bookCoveragePayerRawData,
}) => {
  const { timestamp: latestTimestamp } = await pulseCoreDb
    .collection('lives.history')
    .findOne(
      {
        source,
        territoryType,
      },
      {
        sort: {
          timestamp: -1,
        },
      }
    )

  // the incoming lives data isn't necessarily the latest lives data;
  // if its timestamp is earlier than the latestTimestamp, that
  // means there's no need to rematerialize payerLatestLives and
  // payerLatestLives.totals
  if (incomingTimestamp < latestTimestamp) {
    console.log(
      `FYI: incoming data for ${source} ${territoryType} isn't the latest; skipping materialization to pulse-dev`
    )
    return null
  }

  let latestData = await pulseCoreDb
    .collection('lives.history')
    .find({
      timestamp: latestTimestamp,
      source,
      territoryType,
    })
    .toArray()

  latestData = hydrateLatestData(latestData, bookCoveragePayerRawData)

  console.log('Finished getting latest hydrated data to begin materialization')

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    if (territoryType === 'National') {
      await materializeNationalLives({
        territoryType,
        source,
        latestData,
        pulseDevDb,
        session,
      })
    } else {
      await materializeStateLives({
        territoryType,
        source,
        latestData,
        pulseDevDb,
        session,
      })
    }
  })
}

const hydrateLatestData = (latestData, { books, coverages, payers }) => {
  const booksById = _.mapValues(_.keyBy(books, '_id'), 'name')
  const coveragesById = _.mapValues(_.keyBy(coverages, '_id'), 'name')
  const payersById = _.mapValues(_.keyBy(payers, '_id'), 'slug')

  const formattedData = latestData.map(
    ({
      _id,
      bookId,
      coverageId,
      organizationId,
      timestamp,
      source,
      lives,
      territoryType,
      territoryName,
    }) => {
      return {
        _id,
        book: booksById[bookId], // interestingly, toString() isn't needed on bookId
        coverage: coveragesById[coverageId], // interestingly, toString() isn't needed here
        slug: payersById[organizationId], // interestingly, toString() isn't needed here
        timestamp,
        source,
        lives,
        territoryType,
        territoryName,
      }
    }
  )

  return formattedData
}

module.exports = pushCoreToDev
