const { latestMonthYearPipeline } = require('../../utils')
const persistStateLivesTotals = require('./persist-state-lives-totals')
const persistNationalLivesTotal = require('./persist-national-lives-totals')
const appendLivesPercentData = require('./append-percent-lives')

const pushToDev = async ({
  collectionName,
  pulseCoreDb,
  pulseDevDb,
  terminateScript,
}) => {
  try {
    const latestMonthYearData = await pulseCoreDb.collection(collectionName).aggregate(
      latestMonthYearPipeline, { allowDiskUse: true }
    ).toArray()

    const [{ month, year }] = latestMonthYearData

    await pulseDevDb.collection(collectionName).deleteMany()
    await pulseDevDb.collection(collectionName).insertMany(latestMonthYearData)

    console.log(`pulse-dev collection '${collectionName}' updated to only contain month: ${month}, year: ${year}`)

    const isStateLivesCollection = [
      'payerHistoricalDrgStateLives',
      'payerHistoricalMmitStateLives'
    ].includes(collectionName)

    if (isStateLivesCollection) {
      await persistStateLivesTotals({ latestMonthYearData, collectionName, pulseCoreDb })
    }

    const isNationalLivesCollection = [
      'payerHistoricalDrgNationalLives',
      'payerHistoricalMmitNationalLives'
    ].includes(collectionName)

    if (isNationalLivesCollection) {
      await persistNationalLivesTotal({ latestMonthYearData, collectionName, pulseCoreDb })
      await appendLivesPercentData({ pulseDevDb, pulseCoreDb, terminateScript })
    }
  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = pushToDev
