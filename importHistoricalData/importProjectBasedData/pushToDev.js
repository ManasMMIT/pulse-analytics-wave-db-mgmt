const getSingleProjectLatestMonthYearPipeline = require('./getSingleProjectLatestMonthYearPipeline')
const consolidatePayerData = require('../consolidate-payer-data')

const pushToDev = async ({
  collectionName,
  pulseCoreDb,
  pulseDevDb,
  terminateScript,
  projectName,
  ignoreConsolidatePayerData,
}) => {
  const coreCollection = pulseCoreDb.collection(collectionName)

  const latestSingleProjectSixMonthsDataPromise = coreCollection.aggregate(
    getSingleProjectLatestMonthYearPipeline(projectName, 6), { allowDiskUse: true }
  ).toArray()

  const latestSingleProjectMonthYearDataPromise = coreCollection.aggregate(
    getSingleProjectLatestMonthYearPipeline(projectName, 1), { allowDiskUse: true }
  ).toArray()

  try {
    const [
      latestSingleProjectSixMonthsData,
      latestSingleProjectMonthYearData,
    ] = await Promise.all([
      latestSingleProjectSixMonthsDataPromise,
      latestSingleProjectMonthYearDataPromise,
    ])

    await pulseDevDb.collection(collectionName).deleteMany({
      project: projectName,
    })

    await pulseDevDb.collection(collectionName).insertMany(latestSingleProjectMonthYearData)
    console.log(`pulse-dev collection '${collectionName}' updated for project ${projectName}`)

    await pulseDevDb.collection(`${collectionName}Ht`).deleteMany({
      project: projectName,
    })

    await pulseDevDb.collection(`${collectionName}Ht`).insertMany(latestSingleProjectSixMonthsData)
    console.log(`pulse-dev collection '${collectionName}Ht' updated for project ${projectName}`)

    if (!ignoreConsolidatePayerData) {
      await consolidatePayerData({ pulseDevDb, pulseCoreDb, terminateScript })
    }
  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = pushToDev
