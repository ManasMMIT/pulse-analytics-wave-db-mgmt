const fs = require('fs')
const getSanitizedData = require('./getSanitizedData')

const backupExport = (
  parent,
  { input: { filename, data } },
  context,
  info
) => {
  const cleanData = getSanitizedData(data)

  const jsonString = JSON.stringify(cleanData)

  fs.mkdirSync('./exports-backups', { recursive: true })

  fs.writeFileSync(`./exports-backups/${ filename }.json`, jsonString, err => {
    throw new Error(err)
  })

  return `Export successfully written to ${ filename }`
}

module.exports = backupExport
