const pushSheetToCore = require('./pushSheetToCore')
const pushCoreToDev = require('./pushCoreToDev')

const runNewPipeline = async ({
  timestamp,
  territoryType,
  source,
  data,
  dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
}) => {
  console.time('NEW pipeline')

  console.log('----New Pipeline: Beginning SheetToCore push----')

  const [books, coverages, payers] = await Promise.all([
    pulseCoreDb.collection('books').find().toArray(),
    pulseCoreDb.collection('coverages').find().toArray(),
    pulseCoreDb.collection('organizations').find({ type: 'Payer' }).toArray(),
  ])

  const bookCoveragePayerRawData = { books, coverages, payers }

  await pushSheetToCore({
    bookCoveragePayerRawData,
    timestamp,
    territoryType,
    source,
    data,
    pulseCoreDb,
    mongoClient,
  })

  console.log('----New Pipeline: SheetToCore DONE----')

  console.log('----New Pipeline: Beginning CoreToDev push----')

  await pushCoreToDev({
    incomingTimestamp: timestamp,
    territoryType,
    source,
    dbsConfig: { pulseCoreDb, pulseDevDb, mongoClient },
    bookCoveragePayerRawData,
  })

  console.log('----New Pipeline: CoreToDev DONE----')

  console.timeEnd('NEW pipeline')
}

module.exports = runNewPipeline
