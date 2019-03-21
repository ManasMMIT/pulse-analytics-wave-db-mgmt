const ProgressBar = require('progress');
const Papa = require('papaparse')
const fs = require('fs')

const {
  sanitizeKeysAndTrimData,
  isEmptyRow
} = require('../../utils')

const parseCsvFileAndWriteToDb = ({
  db,
  filepath,
  filename,
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
      data.forEach(({ month, year, ...resultData }) => {
        const newData = {
          ...resultData,
          createdOn: new Date(),
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
            .insertOne(
              newData,
              (err, result) => {
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

        // error out if input month/year doesn't match csv file month/year
        if (resultData.month != fileMonth || resultData.year != fileYear) {
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
