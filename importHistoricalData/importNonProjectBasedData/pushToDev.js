const { latestMonthYearPipeline } = require('../../utils')
const { getStateLivesTotal } = require('./get-payer-lives')
const consolidatePayerData = require('../consolidate-payer-data')

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

    let stateLivesTotals
    if (collectionName === 'payerHistoricalDrgStateLives') {
      statesLivesTotals = getStateLivesTotal(latestMonthYearData)
      await pulseCoreDb.collection('payerDrgStateLivesTotals').deleteMany()
      await pulseCoreDb.collection('payerDrgStateLivesTotals').insertMany(statesLivesTotals)
      console.log(`pulse-core collection 'payerDrgStateLivesTotals' updated`)
    } else if (collectionName === 'payerHistoricalMmitStateLives') {
      // TODO: if it's MMIT lives data, you also have to resync the MMIT lives with the DRG lives
      statesLivesTotals = getStateLivesTotal(latestMonthYearData)
      await pulseCoreDb.collection('payerMmitStateLivesTotals').deleteMany()
      await pulseCoreDb.collection('payerMmitStateLivesTotals').insertMany(statesLivesTotals)
      console.log(`pulse-core collection 'payerMmitStateLivesTotals' updated`)
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
