const { latestMonthYearPipeline } = require('../../utils')
const persistStateLivesTotals = require('./persist-state-lives-totals')
const consolidatePayerData = require('../consolidate-payer-data')

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

    await consolidatePayerData({ pulseDevDb, pulseCoreDb, terminateScript })
  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = pushToDev
