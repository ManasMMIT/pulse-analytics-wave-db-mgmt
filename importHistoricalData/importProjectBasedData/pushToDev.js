const getLatestMonthYearProjectPipeline = require('./latest-month-year-project')

const pushToDev = async ({
  collectionName,
  pulseCoreDb,
  pulseDevDb,
  terminateScript
}) => {
  const coreCollection = pulseCoreDb.collection(collectionName)

  let adminHubPayerIndRegCombosPromise = null

  // only execute this parallel aggregation if the collection is qoa data
  if (collectionName === 'payerHistoricalQualityAccess') {
    adminHubPayerIndRegCombosPromise = coreCollection.aggregate([
      {
        $group: {
          _id: '$indication',
          regimen: {
            $addToSet: '$regimen'
          }
        }
      },
      {
        $project: {
          _id: 0,
          indication: '$_id',
          regimen: 1
        }
      }
    ]).toArray()
  }

  const latestSixMonthsDataPromise = coreCollection.aggregate(
    getLatestMonthYearProjectPipeline(6), { allowDiskUse: true }
  ).toArray()

  const latestMonthYearDataPromise = coreCollection.aggregate(
    getLatestMonthYearProjectPipeline(1), { allowDiskUse: true }
  ).toArray()

  try {
    const [
      adminHubPayerIndRegCombos,
      latestSixMonthsData,
      latestMonthYearData,
    ] = await Promise.all([
      adminHubPayerIndRegCombosPromise,
      latestSixMonthsDataPromise,
      latestMonthYearDataPromise,
    ])

    if (adminHubPayerIndRegCombos) {
      await pulseDevDb.collection('adminHubPayerIndRegCombos').deleteMany()
      await pulseDevDb.collection('adminHubPayerIndRegCombos').insertMany(adminHubPayerIndRegCombos)
      console.log(`pulse-dev collection 'adminHubPayerIndRegCombos' updated`)
    }

    await pulseDevDb.collection(collectionName).deleteMany()
    await pulseDevDb.collection(collectionName).insertMany(latestMonthYearData)
    console.log(`pulse-dev collection '${collectionName}' updated`)

    await pulseDevDb.collection(`${collectionName}Ht`).deleteMany()
    await pulseDevDb.collection(`${collectionName}Ht`).insertMany(latestSixMonthsData)
    console.log(`pulse-dev collection '${collectionName}Ht' updated`)

  } catch(e) {
    console.error(e)
  } finally {
    console.log('Script finished executing')
    await terminateScript()
  }
}

module.exports = pushToDev
