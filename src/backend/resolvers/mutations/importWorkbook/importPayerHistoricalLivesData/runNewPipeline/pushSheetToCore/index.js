const formatData = require('./format-data')

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

    // Step 2: Delete any existing lives.history data for source/timestamp/territoryType
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

    // Step 3: Insert the new data into lives.history
    await pulseCoreDb
      .collection('lives.history')
      .insertMany(formattedData, { session })
  })

  console.log(
    `pulse-core.lives.history data replaced for ${source}|${territoryType}|${timestamp.toLocaleString()}`
  )
}

module.exports = pushSheetToCore
