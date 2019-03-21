const connectToMongoDb = require('../../connect-to-mongodb')
const parseCsvFileAndWriteToDb = require('./parse-csv-file-and-write-to-db')
const {
  getScriptTerminator,
  verifyCollectionExists
} = require('../../utils')

const historicalDataLoaderV1 = async filepath => {
  // Extract filename, month, year based on filepath
  const filePathArr = filepath.split('/')
  const filenameWithExtension =   filePathArr[filePathArr.length - 1]
  const regEx = /(.+?)(\.[^.]*$|$)/g
  const capturedFilename = regEx.exec(filenameWithExtension)
  const [filename, fileMonth, fileYear] = capturedFilename[1].split('-')

  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const db = await mongoConnection.db('pulse-dev')

  console.log('----------Historical Data Loader-----------')
  console.log('Running loader...')

  await verifyCollectionExists(filename, db, mongoConnection)

  // Remove rows before appending
  await db.collection(filename)
    .deleteMany({
      $and: [
        { $or: [{ month: Number(fileMonth) }, { month: fileMonth }] },
        { $or: [{ year: Number(fileYear) }, { year: fileYear }] }
      ]
    })
    .catch(async err => await terminateScript(err))

  console.log(`Deleted Rows for Month:${fileMonth} Year:${fileYear}`)

  parseCsvFileAndWriteToDb({
    db,
    filepath,
    filename,
    fileMonth,
    fileYear,
    terminateScript
  })
}

module.exports = historicalDataLoaderV1
