const fs = require('fs')
const _ = require('lodash')
const Papa = require('papaparse')
const connectToMongoDb = require('../connect-to-mongodb')

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

const sanitizeKeysAndValues = obj => (
  _.reduce(obj, (acc, v, k) => {
    acc[k.trim()] = v.trim()
    return acc
  }, {})
)

const connectToMongoAndWriteCsvToDb = async () => {
  const mongoConnection = await connectToMongoDb()
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  const stream = fs.createReadStream(filepath)

  let data = []

  Papa.parse(stream, {
    header: true, // with header true, step func parses rows after the first row
    delimiter: ',',
    skipEmptyLines: true,
    complete: async () => {
      if (_.isEmpty(data)) {
        console.log('No data made it through parsing stream')
        process.exit()
      }

      data = data.map(sanitizeKeysAndValues)

      data = _.groupBy(data, 'indication')

      data = _.map(data, (arrOfObjs, indication) => {
        return {
          indication,
          regimen: arrOfObjs.map(obj => obj.regimen),
          createdOn: new Date()
        }
      })

      await pulseDevDb.collection('adminHubProviderIndRegCombos').deleteMany()
        .catch(async err => {
          console.error('Error removing existing data', err)
          await mongoConnection.close()
          process.exit()
        })

      await pulseDevDb.collection('adminHubProviderIndRegCombos').insertMany(data)
        .catch(console.error)
        .finally(async () => {
          console.log('Script finished executing.')
          await mongoConnection.close()
          process.exit()
        })
    },
    step: function (results, parser) {
      data.push(results.data[0])
    },
    error: async (err, file, inputElem, reason) => {
      console.error(`Error from Papa parse operation: ${err}`)
      await mongoConnection.close()
      process.exit()
    }
  })
}

connectToMongoAndWriteCsvToDb()
