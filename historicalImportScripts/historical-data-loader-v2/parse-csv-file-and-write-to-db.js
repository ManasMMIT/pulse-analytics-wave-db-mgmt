const _ = require('lodash')
const ProgressBar = require('progress');
const Papa = require('papaparse')
const fs = require('fs')
const mongo = require('mongodb')

const {
  sanitizeKeysAndTrimData,
  isEmptyRow
} = require('../../utils')

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
    skipEmptyLines: true, // TODO: if this is on, do we need to check for it in #step?
    complete: function () {
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
    step: function (results, parser) {
      const isEmptyLine = isEmptyRow(results.data[0])
      // Check if it's empty row
      if (!isEmptyLine && rowParseCount > 1) {
        // Sanitize keys and push to data variable
        const resultData = sanitizeKeysAndTrimData(results.data[0])
        data.push(resultData)
      }

      rowParseCount++
    },
    error: function (err, file, inputElem, reason) {
      console.error(`Error from Papa parse operation: ${err}`)
      process.exit()
    }
  })
}

module.exports = parseCsvFileAndWriteToDb
