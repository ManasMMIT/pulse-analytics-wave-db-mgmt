const _ = require('lodash')
const Papa = require('papaparse')
const fs = require('fs')

const {
  sanitizeKeysAndTrimData,
  isEmptyRow
} = require('../utils')

const parseCsvFile = ({
  filepath,
  projectName,
  fileMonth,
  fileYear,
}) => new Promise((resolve, reject) => {
  const stream = fs.createReadStream(filepath)
  // used to skip the two rows after the header row
  let rowParseCount = 0

  // toggled and used if parsing is interrupted to terminate script
  let wasParserAborted = false

  const data = []

  Papa.parse(stream, {
    header: true,
    delimiter: ',',
    skipEmptyLines: true, // TODO: investigate why we need this if we're already checking for isEmptyRow
    complete: () => {
      if (wasParserAborted) {
        reject('CSV parsing was aborted mid-stream')
        return
      } else if (_.isEmpty(data)) {
        reject('No data made it through parsing stream')
        return
      }

      const projectObj = projectName ? { project: projectName } : {}

      const formattedData = data.map(resultData => {
        const newData = {
          ...resultData,
          createdOn: new Date(),
          month: fileMonth,
          year: fileYear,
          ...projectObj
        }

        return newData
      })

      resolve(formattedData)
    },
    step: (results, parser) => {
      const rowIndex = rowParseCount++ // this returns the number PRE-incrementation
      if (rowIndex < 2) return // skip processing the row if it's first two rows

      let row = results.data[0]
      row = sanitizeKeysAndTrimData(row)

      // skip processing the row if it's empty after sanitization
      if (isEmptyRow(row)) return

      // if there's no month/year, default to fileMonth and fileYear
      row.month = Number(row.month) || fileMonth
      row.year = Number(row.year) || fileYear

      // error out if row has month/year but it doesn't match file month/year
      if (row.month !== fileMonth || row.year !== fileYear) {
        wasParserAborted = true
        console.error('At least this row doesn\'t match file name\'s month and year', row)
        parser.abort()
        return
      }

      data.push(row)
    },
    error: reject
  })
})

module.exports = parseCsvFile
