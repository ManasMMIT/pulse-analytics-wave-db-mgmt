const connectToMongoDb = require('../../connect-to-mongodb')
const parseCsvFileAndWriteToDb = require('../parse-csv-file-and-write-to-db')
const pushToDev = require('./pushToDev')
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

  // Remove rows before appending
  await pulseCoreDb.collection(collectionName)
    .deleteMany({
      $and: [
        { $or: [{ month: Number(fileMonth) }, { month: fileMonth }] },
        { $or: [{ year: Number(fileYear) }, { year: fileYear }] }
      ]
    })
    .catch(async err => await terminateScript(err))

  const monthYear = `Month:${fileMonth} Year:${fileYear}`

  console.log(`Deleted Rows for ${monthYear} from pulse-core`)

  await parseCsvFileAndWriteToDb({
    db: pulseCoreDb,
    filepath,
    collectionName,
    fileMonth,
    fileYear
  }).catch(async err => await terminateScript(err))

  console.log(`New data for ${monthYear} inserted into pulse-core`)

  pushToDev({
    collectionName,
    pulseCoreDb,
    pulseDevDb,
    terminateScript
  })
}

module.exports = importNonProjectBasedData
