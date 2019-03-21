const ProgressBar = require('progress');
const MongoClient = require('mongodb').MongoClient
const Papa =  require('papaparse')
const fs = require('fs')
const path = require('path')
const mongo = require('mongodb')
const _ = require('lodash')
const {
  sanitizeKeysAndTrimData,
  isEmptyRow,
  LOADER_URI,
  getCollectionDoesNotExistError
} = require('./utils')

const parseCsvFileAndWriteToDb = ({
  db,
  filepath,
  projectName,
  collectionName,
  fileMonth,
  fileYear,
  terminateScript
}) => {
  const stream = fs.createReadStream(filepath)
  // used to skip the two rows after the header row
  // TODO: consider using the validation row instead of disregarding it
  let rowParseCount = 0

  let rowInsertionCount = 0 // used for insertion progress bar
  let data = []

  // Parse Data
  Papa.parse(stream, {
    header: true, // with header true, step func parses rows after the first row
    delimiter: ',',
    skipEmptyLines: true,
    complete: function() {
      if (_.isEmpty(data)) {
        console.log('No data made it through parsing stream')
        process.exit()
      }

      data.forEach(resultData => {
        const objectId = new mongo.ObjectId()
        const newData = {
          ...resultData,
          _id: objectId,
          createdOn: objectId.getTimestamp(),
          month: fileMonth,
          year: fileYear,
          project: projectName
        }

        const bar = new ProgressBar('  Uploading [:bar] :current :percent', {
          complete: '█',
          incomplete: '░',
          width: 80,
          total: data.length
        })

        // Write to MongoDB
        db.collection(collectionName)
          .insert(
            newData,
            (err, result) => {
              if (err) {
                console.log(err)
              } else {
                rowInsertionCount++
                bar.tick(rowInsertionCount)
                if (rowInsertionCount === data.length) process.exit()
              }
            }
          )
      })
    },
    step: function(results, parser) {
      const isEmptyLine = isEmptyRow(results.data[0])
      // Check if it's empty row
      if (!isEmptyLine && rowParseCount > 1) {
        // Sanitize keys and push to data variable
        const resultData = sanitizeKeysAndTrimData(results.data[0])
        data.push(resultData)
      }

      rowParseCount++
    },
    error: function(err, file, inputElem, reason) {
      console.error(`Error from Papa parse operation: ${err}`)
      process.exit()
    }
  })
}

const historicalDataLoaderV2 = async filepath => {
  // Extract project, filename, month, year based on filepath
  const filePathArr = filepath.split('/')
  const filenameWithExtension = filePathArr[filePathArr.length - 1]
  const regEx = /(.+?)(\.[^.]*$|$)/g
  const capturedFilename = regEx.exec(filenameWithExtension)
  let [projectName, filename, fileMonth, fileYear] = capturedFilename[1].split('-')
  // Create collectionName from fileName and format other fields as needed
  fileMonth = parseInt(fileMonth)
  fileYear = parseInt(fileYear)
  projectName = _.startCase(projectName)
  const collectionName = _.camelCase(`payerHistorical ${ filename }`)

  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const db = await mongoConnection.db('test')

  console.log('----------Historical Data Loader-----------')
  console.log('Running loader...')

  await verifyCollectionExists(filename, db, mongoConnection)

  // Remove rows before appending
  await db.collection(collectionName)
    .deleteMany({
      month: fileMonth,
      year: fileYear,
      project: projectName
    })
    .catch(async err => await terminateScript(err))

  console.log(`Deleted Rows for Month: ${fileMonth} Year: ${fileYear} for Project: ${projectName}`)

  parseCsvFileAndWriteToDb({
    db,
    filepath,
    projectName,
    collectionName,
    fileMonth,
    fileYear,
    terminateScript
  })
}

module.exports = historicalDataLoaderV2
