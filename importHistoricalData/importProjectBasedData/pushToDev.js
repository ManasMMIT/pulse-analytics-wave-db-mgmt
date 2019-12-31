const getLatestMonthYearProjectPipeline = require('./latest-month-year-project')
const consolidatePayerData = require('../consolidate-payer-data')

const pushToDev = async ({
  collectionName,
  pulseCoreDb,
  pulseDevDb,
  terminateScript
}) => {
  const coreCollection = pulseCoreDb.collection(collectionName)

  const latestSixMonthsDataPromise = coreCollection.aggregate(
    getLatestMonthYearProjectPipeline(6), { allowDiskUse: true }
  ).toArray()

  const latestMonthYearDataPromise = coreCollection.aggregate(
    getLatestMonthYearProjectPipeline(1), { allowDiskUse: true }
  ).toArray()

  try {
    const [
      latestSixMonthsData,
      latestMonthYearData,
    ] = await Promise.all([
      latestSixMonthsDataPromise,
      latestMonthYearDataPromise,
    ])

    await pulseDevDb.collection(collectionName).deleteMany()
    await pulseDevDb.collection(collectionName).insertMany(latestMonthYearData)
    console.log(`pulse-dev collection '${collectionName}' updated`)

    await pulseDevDb.collection(`${collectionName}Ht`).deleteMany()
    await pulseDevDb.collection(`${collectionName}Ht`).insertMany(latestSixMonthsData)
    console.log(`pulse-dev collection '${collectionName}Ht' updated`)

    await consolidatePayerData({ pulseDevDb, pulseCoreDb, terminateScript })
  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = pushToDev
