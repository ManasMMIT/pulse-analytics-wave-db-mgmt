const importNonProjectBasedData = require('./importNonProjectBasedData')
const importProjectBasedData = require('./importProjectBasedData')

const fs = require('fs')

const args = require('yargs')
  .usage('Usage: $0 --filepath [string] --ignoreProjects [boolean] --ignoreConsolidatePayerData [boolean]')
  .demandOption(['filepath'])
  .argv

const filepath = args.filepath

function fileExists(filePath) {
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

if (args.ignoreProjects) {
  importNonProjectBasedData(filepath)
} else {
  importProjectBasedData(filepath, args.ignoreConsolidatePayerData)
}
