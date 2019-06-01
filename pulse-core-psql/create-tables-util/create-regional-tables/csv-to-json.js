const fs = require('fs')
const Papa = require('papaparse')
const { sanitizeKeysAndTrimData } = require('../../../utils')

const csvToJson = filepath => {
  const stream = fs.createReadStream(filepath)
  let data = []

  const promise = new Promise((resolve, reject) => {
    Papa.parse(stream, {
      header: true, // with header true, step func parses rows after the first row
      delimiter: ',',
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: () => {
        data = data.map(sanitizeKeysAndTrimData)
        resolve(data)
      },
      step: results => data.push(results.data[0]),
      error: reject,
    })
  })

  return promise
}

module.exports = csvToJson
