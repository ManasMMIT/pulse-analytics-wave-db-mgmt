const connectToMongoDb = require('../../connect-to-mongodb')
const parseCsvFile = require('../parse-csv-file')
const pushToDev = require('./pushToDev')
const synchronizeDrgMmitMedicalLives = require('./syncDrgMmitMedicalLives')
const {
  getScriptTerminator,
  verifyCollectionExists
} = require('../../utils')

const importNonProjectBasedData = async filepath => {
  // Extract filename, month, year based on filepath
  const filePathArr = filepath.split('/')
  const filenameWithExtension =   filePathArr[filePathArr.length - 1]
  const regEx = /(.+?)(\.[^.]*$|$)/g
  const capturedFilename = regEx.exec(filenameWithExtension)
  let [collectionName, fileMonth, fileYear] = capturedFilename[1].split('-')
  fileMonth = parseInt(fileMonth)
  fileYear = parseInt(fileYear)

  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')
  const pulseCoreDb = await mongoConnection.db('pulse-core')

  console.log('----------Historical Data Loader-----------')
  console.log('Running loader...')

  await verifyCollectionExists(collectionName, pulseCoreDb, mongoConnection)

  try {
    // Remove rows before appending
    await pulseCoreDb.collection(collectionName)
      .deleteMany({
        $and: [
          { $or: [{ month: Number(fileMonth) }, { month: fileMonth }] },
          { $or: [{ year: Number(fileYear) }, { year: fileYear }] }
        ]
      })

    const monthYear = `Month: ${fileMonth} Year: ${fileYear}`

    console.log(`Deleted Rows for ${monthYear} from pulse-core`)

    // TODO: validate against slugless entries making it into the DB

    // TODO: investigate how older data has whitespaces despite trim operation
    // consider dynamic typing option in Papaparse

    const formattedData = await parseCsvFile({ filepath, fileMonth, fileYear })
    await pulseCoreDb.collection(collectionName).insertMany(formattedData)
    console.log(`New data for ${monthYear} inserted into pulse-core \n`)

    const isMmitStateLives = collectionName === 'payerHistoricalMmitStateLives'
    if (isMmitStateLives) await synchronizeDrgMmitMedicalLives(pulseCoreDb)
  } catch (e) {
    await terminateScript(e)
  }

  pushToDev({
    collectionName,
    pulseCoreDb,
    pulseDevDb,
    terminateScript,
  })
}

module.exports = importNonProjectBasedData
