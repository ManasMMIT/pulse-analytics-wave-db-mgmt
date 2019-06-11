const { latestMonthYearPipeline } = require('../../utils')
const { getStateLivesTotals } = require('./get-payer-lives')
const consolidatePayerData = require('../consolidate-payer-data')

const persistStateLivesTotals = async ({
  latestMonthYearData,
  collectionName,
  pulseCoreDb,
}) => {
  const totalsCollectionName = collectionName === 'payerHistoricalDrgStateLives'
    ? 'payerDrgStateLivesTotals'
    : 'payerMmitStateLivesTotals'

  const stateLivesTotals = getStateLivesTotals(latestMonthYearData)

  await pulseCoreDb.collection(totalsCollectionName).deleteMany()
  await pulseCoreDb.collection(totalsCollectionName).insertMany(stateLivesTotals)

  console.log(`pulse-core collection '${totalsCollectionName}' updated`)
}

const pushToDev = async ({
  collectionName,
  pulseCoreDb,
  pulseDevDb,
  terminateScript
}) => {
  try {
    const latestMonthYearData = await pulseCoreDb.collection(collectionName).aggregate(
      latestMonthYearPipeline, { allowDiskUse: true }
    ).toArray()

    const [{ month, year }] = latestMonthYearData

    await pulseDevDb.collection(collectionName).deleteMany()
    await pulseDevDb.collection(collectionName).insertMany(latestMonthYearData)

    console.log(`pulse-dev collection '${collectionName}' updated to only contain month: ${month}, year: ${year}`)

    const isLivesCollection = [
      'payerHistoricalDrgStateLives',
      'payerHistoricalMmitStateLives'
    ].includes(collectionName)

    if (isLivesCollection) {
      await persistStateLivesTotals({ latestMonthYearData, collectionName, pulseCoreDb })
    }

    // TODO: if it's MMIT lives data, you also have to resync the MMIT lives with the DRG lives

    await consolidatePayerData({ pulseDevDb, pulseCoreDb, terminateScript })
  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = pushToDev
