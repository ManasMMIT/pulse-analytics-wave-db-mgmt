const _ = require('lodash')
const ProgressBar = require('progress');
const Papa = require('papaparse')
const fs = require('fs')

const {
  sanitizeKeysAndTrimData,
  isEmptyRow
} = require('../utils')

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

  Papa.parse(stream, {
    header: true,
    delimiter: ',',
    skipEmptyLines: true, // TODO: if this is on, do we need to check for it in #step?
    complete: function () {
      if (_.isEmpty(data)) {
        terminateScript('No data made it through parsing stream')
      }

      const projectObj = projectName ? { project: projectName } : {}

      data.forEach(resultData => {
        const newData = {
          ...resultData,
          createdOn: new Date(),
          month: fileMonth,
          year: fileYear,
          ...projectObj
        }

        if (data.length !== 0) {
          const bar = new ProgressBar('  Uploading [:bar] :current :percent', {
            complete: '█',
            incomplete: '░',
            width: 80,
            total: data.length
          })

          // Write to MongoDB
          db.collection(collectionName)
            .insertOne(
              newData,
              err => {
                if (err) {
                  console.error(err)
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
    step: async results => {
      const isEmptyLine = isEmptyRow(results.data[0])

      // skip processing the row if it's empty or it's the first two rows
      if (!isEmptyLine && rowParseCount > 1) {
        const resultData = sanitizeKeysAndTrimData(results.data[0])
        resultData.month = parseInt(resultData.month)
        resultData.year = parseInt(resultData.year)

        // error out if input month/year doesn't match csv file month/year
        if (resultData.month !== fileMonth || resultData.year !== fileYear) {
          await terminateScript('At least this row doesn\'t match file name\'s month and year', resultData)
        }

        data.push(resultData)
      }

      rowParseCount++
    },
    error: async err => { await terminateScript('Error from Papa parse operation:', err) }
  })
}

module.exports = parseCsvFileAndWriteToDb
