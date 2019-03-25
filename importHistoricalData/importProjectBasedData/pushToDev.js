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

  // const latestMonthYearDataPromise = coreCollection.aggregate(
  //   getLatestMonthYearProjectPipeline(1)
  // ).toArray()

  try {
    const [
      adminHubPayerIndRegCombos,
      latestSixMonthsData,
      // latestMonthYearData,
    ] = await Promise.all([
      adminHubPayerIndRegCombosPromise,
      latestSixMonthsDataPromise,
      // latestMonthYearDataPromise,
    ])

    if (adminHubPayerIndRegCombos) {
      await pulseDevDb.collection('adminHubPayerIndRegCombos').deleteMany()
      await pulseDevDb.collection('adminHubPayerIndRegCombos').insertMany(adminHubPayerIndRegCombos)
      console.log(`pulse-dev collection 'adminHubPayerIndRegCombos' updated`)
    }

    // Eventually this pulse-dev collection will only hold the latest month/year but it'll temporarily
    // hold the last six months, as historical trends page needs that for now.
    await pulseDevDb.collection(collectionName).deleteMany()
    await pulseDevDb.collection(collectionName).insertMany(latestSixMonthsData)
    console.log(`pulse-dev collection '${collectionName}' updated`)

    // Also insert latestSixMonths as separate historical trends collection.
    // Plan is to switch historical trends onto this and then overwrite the original collections
    // to only have the latest data.
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
