const ProgressBar = require('progress');
const MongoClient = require('mongodb').MongoClient
const Papa =  require('papaparse')
const fs = require('fs')
const path = require('path')
const mongo = require('mongodb')
const {
  sanitizeKeysAndTrimData,
  isEmptyRow,
  LOADER_URI,
  getCollectionDoesNotExistError
} = require('./utils')

const parseCsvFileAndWriteToDb = (db, filepath, filename, fileMonth, fileYear) => {
  const stream = fs.createReadStream(filepath)
  // used to skip the two rows after the header row
  // TODO: consider using the validation row instead of disregarding it
  let rowParseCount = 0

  let rowInsertionCount = 0 // used for insertion progress bar
  let data = []

  Papa.parse(stream, {
    header: true,
    delimiter: ',',
    skipEmptyLines: true,
    complete: function() {
      data.forEach(({ month, year, ...resultData }) => {
        const objectId = new mongo.ObjectId()
        const newData = {
          ...resultData,
          _id: objectId,
          createdOn: objectId.getTimestamp(),
          month: parseInt(month),
          year: parseInt(year)
        }

        if (data.length !== 0) {
          const bar = new ProgressBar('  Uploading [:bar] :current :percent', {
            complete: '█',
            incomplete: '░',
            width: 80,
            total: data.length
          })

          // Write to MongoDB
          db.collection(filename)
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
        }
      })
    },
    step: function(results, parser) {
      // Delete Rows belonging to month and year in script arguments
      const isEmptyLine = isEmptyRow(results.data[0])

      // Check if it's empty row
      if(!isEmptyLine && rowParseCount > 1) {
        const resultData = sanitizeKeysAndTrimData(results.data[0])

        // Check if line is empty
        data.push(resultData)

        // Check to see if input month matches csv file month
        if (resultData.month != fileMonth || resultData.year != fileYear) {
          console.log('CSV file does not appear to have the correct corresponding month')
          process.exit()
        }
      }

      rowParseCount++
    },
    error: function(err, file, inputElem, reason) {
      console.error(`Error from Papa parse operation: ${err}`)
      process.exit()
    }
  })
}

const historicalDataLoaderV1 = filepath => {
  // Extract filename, month, year based on filepath
  const filePathArr = filepath.split('/')
  const filenameWithExtension =   filePathArr[filePathArr.length - 1]
  const regEx = /(.+?)(\.[^.]*$|$)/g
  const capturedFilename = regEx.exec(filenameWithExtension)
  const [filename, fileMonth, fileYear] = capturedFilename[1].split('-')

  MongoClient.connect(LOADER_URI, function(err, dbs) {
    console.log('----------Historical Data Loader-----------')

    if (err) {
      console.log('Error connecting to DB')
      console.log(err)
    } else {
      console.log('Running loader...')
      const db = dbs.db('pulse-dev')

      db.listCollections({name: filename}).toArray(function(err, items) {
        if (items.length === 0) {
          console.log(getCollectionDoesNotExistError(filename))
          process.exit()
        } else {
          // Remove rows before appending
          db.collection(filename)
            .deleteMany(
              {
                $and: [
                  { $or: [{ month: Number(fileMonth) }, { month: fileMonth }] },
                  { $or: [{ year: Number(fileYear) }, { year: fileYear }] }
                ]
              },
              (err, result) => {
                if (err) {
                  console.log(err)
                  process.exit()
                }

                console.log(`Deleted Rows for Month:${fileMonth} Year:${fileYear}`)
                parseCsvFileAndWriteToDb(db, filepath, filename, fileMonth, fileYear)
              }
            )
        }
      })
    }
  })
}

module.exports = historicalDataLoaderV1
