const fs = require('fs')

const backupExport = (
  parent,
  { input: { filename, data } },
  context,
  info
) => {
  const jsonString = JSON.stringify(data)

  fs.mkdirSync('./exports-backups', { recursive: true })

  fs.writeFileSync(`./exports-backups/${ filename }.json`, jsonString, err => {
    throw new Error(err)
  })

  return `Export successfully written to ${ filename }`
}

module.exports = backupExport
