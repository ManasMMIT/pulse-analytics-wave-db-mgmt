const latestMonthYearPipeline = require('../latest-month-year-agg-pipeline')
const persistStateLivesTotals = require('./persist-state-lives-totals')
const persistNationalLivesTotal = require('./persist-national-lives-totals')
const appendLivesPercentData = require('./append-percent-lives')

const pushCoreToDev = async ({
  collectionName,
  pulseCoreDb,
  pulseDevDb,
  mongoClient,
}) => {
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    const latestMonthYearData = await pulseCoreDb
      .collection(collectionName)
      .aggregate(latestMonthYearPipeline, { session, allowDiskUse: true })
      .toArray()

    const [{ month, year }] = latestMonthYearData

    await pulseDevDb.collection(collectionName).deleteMany({}, { session })

    await pulseDevDb
      .collection(collectionName)
      .insertMany(latestMonthYearData, { session })

    console.log(
      `pulse-dev collection '${collectionName}' updated to only contain month: ${month}, year: ${year}`
    )

    const isStateLivesCollection = [
      'payerHistoricalDrgStateLives',
      'payerHistoricalMmitStateLives',
    ].includes(collectionName)

    if (isStateLivesCollection) {
      await persistStateLivesTotals({
        latestMonthYearData,
        collectionName,
        pulseCoreDb,
        session,
      })
    }

    const isNationalLivesCollection = [
      'payerHistoricalDrgNationalLives',
      'payerHistoricalMmitNationalLives',
    ].includes(collectionName)

    if (isNationalLivesCollection) {
      await persistNationalLivesTotal({
        latestMonthYearData,
        collectionName,
        pulseCoreDb,
        session,
      })

      await appendLivesPercentData({
        pulseDevDb,
        pulseCoreDb,
        session,
      })
    }
  })
}

module.exports = pushCoreToDev
