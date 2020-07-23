const formatData = require('./format-data')
const mergeLatestDrgStateMedicalLives = require('./mergeLatestDrgStateMedicalLives')

const pushSheetToCore = async ({
  timestamp,
  territoryType,
  source,
  data,
  pulseCoreDb,
  mongoClient,
  bookCoveragePayerRawData,
}) => {
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Format the data (expand each doc to 12 docs for book/coverage breakdown)
    let formattedData = formatData({
      data,
      timestamp,
      territoryType,
      source,
      bookCoveragePayerRawData,
    })
    console.log(`Sheet data formatted for core`)

    // Step 2: If the data is MMIT state data, replace any medical coverage data
    // with the latest DRG state medical lives data
    if (source === 'MMIT' && territoryType === 'U.S. State') {
      formattedData = await mergeLatestDrgStateMedicalLives({
        formattedData,
        pulseCoreDb,
        timestamp,
      })

      console.log(`MMIT state Lives data synced with DRG medical state lives`)
    }

    // Step 3: Delete any existing lives.history data for source/timestamp/territoryType
    await pulseCoreDb.collection('lives.history').deleteMany(
      {
        source,
        timestamp,
        territoryType,
      },
      {
        session,
      }
    )

    // Step 4: Insert the new data into lives.history
    await pulseCoreDb
      .collection('lives.history')
      .insertMany(formattedData, { session })
  })

  console.log(
    `pulse-core.lives.history data replaced for ${source}|${territoryType}|${timestamp.toLocaleString()}`
  )
}

module.exports = pushSheetToCore
