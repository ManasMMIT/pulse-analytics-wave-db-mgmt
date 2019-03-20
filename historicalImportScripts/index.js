const historicalDataLoaderV1 = require('./historical-data-loader-v1')
const historicalDataLoaderV2 = require('./historical-data-loader-v2')

const fs = require('fs')

const args = require('yargs')
  .usage('Usage: $0 --filepath [string] --ignoreProjects [boolean]')
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
  historicalDataLoaderV1(filepath)
} else {
  historicalDataLoaderV2(filepath)
}
