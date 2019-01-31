const fs = require('fs')
const importListsConfig = require('./importListsConfig')

const args = require('yargs')
  .usage('Usage: $0 --filepath [string]')
  .demandOption(['filepath'])
  .argv

const filepath = args.filepath

const fileExists = filePath => {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

// If file doesn't exist, terminate the script
if (!fileExists(filepath)) {
  console.log('File does not exist.')
  process.exit()
}

importListsConfig(filepath)
