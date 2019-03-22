const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')
const connectToMongoDb = require('../connect-to-mongodb')
const {
  sanitizeKeysAndTrimData,
  getScriptTerminator
} = require('../utils')

const args = require('yargs')
  .usage('Usage: $0 --filepath [string]')
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

const COLLECTION_NAME = 'adminHubProviderIndRegCombos'

const connectToMongoAndWriteCsvToDb = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  const stream = fs.createReadStream(filepath)

  let data = []

  Papa.parse(stream, {
    header: true, // with header true, step func parses rows after the first row
    delimiter: ',',
    skipEmptyLines: true,
    complete: async () => {
      if (_.isEmpty(data)) {
        await terminateScript('No data made it through parsing stream')
      }

      data = data.map(sanitizeKeysAndTrimData)

      data = _.groupBy(data, 'indication')

      data = _.map(data, (arrOfObjs, indication) => {
        return {
          indication,
          regimen: arrOfObjs.map(obj => obj.regimen),
          createdOn: new Date()
        }
      })

      await pulseDevDb.collection(COLLECTION_NAME).deleteMany()
        .catch(async err => {
          await terminateScript('Error removing existing data', err)
        })

      await pulseDevDb.collection(COLLECTION_NAME).insertMany(data)
        .catch(console.error)
        .finally(async () => {
          console.log('Script finished executing.')
          await terminateScript()
        })
    },
    step: function (results, parser) {
      data.push(results.data[0])
    },
    error: async err => {
      await terminateScript('Error from Papa parse operation', err)
    }
  })
}

connectToMongoAndWriteCsvToDb()
