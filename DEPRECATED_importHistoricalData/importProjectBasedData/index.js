const _ = require('lodash')
const connectToMongoDb = require('../../connect-to-mongodb')
const parseCsvFile = require('../parse-csv-file')
const pushToDev = require('./pushToDev')
const stringSimilarity = require('string-similarity')
const {
  getScriptTerminator,
  verifyCollectionExists
} = require('../../utils')

const importProjectBasedData = async (filepath, ignoreConsolidatePayerData) => {
  // Extract project, filename, month, year based on filepath
  const filePathArr = filepath.split('/')
  const filenameWithExtension = filePathArr[filePathArr.length - 1]
  const regEx = /(.+?)(\.[^.]*$|$)/g
  const capturedFilename = regEx.exec(filenameWithExtension)
  let [projectName, filename, fileMonth, fileYear] = capturedFilename[1].split('-')
  // Create collectionName from fileName and format other fields as needed
  fileMonth = parseInt(fileMonth)
  fileYear = parseInt(fileYear)
  projectName = _.startCase(projectName)
  const collectionName = _.camelCase(`payerHistorical ${ filename }`)

  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseDevDb = await mongoConnection.db('pulse-dev')
  const pulseCoreDb = await mongoConnection.db('pulse-core')

  console.log('----------Historical Data Loader-----------')
  console.log('Running loader...')

  await verifyCollectionExists(collectionName, pulseCoreDb, mongoConnection)

  const formattedData = await parseCsvFile({
    filepath,
    projectName,
    fileMonth,
    fileYear,
  }).catch(terminateScript)

  // TODO: validate against slugless entries making it into the DB

  if (collectionName === 'payerHistoricalQualityAccess') {
    const qualityOfAccessScore = await pulseCoreDb.collection('qualityOfAccessScore').find().toArray()
    const validAccesses = _.keyBy(qualityOfAccessScore, 'access')
    
    const ROWS_TO_SKIP = 4 // add 1 for zero indexing, add 3 for rows skipped
    const problemRows = []
    const invalidAccesses = formattedData.filter(({ access }, i) => {
      const isAccessInvalid = !validAccesses[access]
      if (isAccessInvalid) problemRows.push(i + ROWS_TO_SKIP) 
      return isAccessInvalid
    })

    const numInvalidAccesses = invalidAccesses.length

    if (numInvalidAccesses > 0) {
      console.error('Access validation failed!')
      console.error(`Incoming data has ${numInvalidAccesses} invalid access entries.`)
      console.error(`Problem rows in CSV are: ${problemRows.join(', ')}`)
      const uniqueInvalidAccesses = _.uniqBy(invalidAccesses, 'access').map(({ access }) => access)

      const validAccessArr = Object.keys(validAccesses)
      const suggestions = uniqueInvalidAccesses.map(invalidAccess => {
        const { bestMatch: { target } } = stringSimilarity.findBestMatch(invalidAccess, validAccessArr)
        return { 'Invalid Access': invalidAccess, 'Did you mean...?': target }
      })

      console.error('Your unique invalid accesses are:')
      console.table(suggestions, ['Invalid Access', 'Did you mean...?'])

      await terminateScript()
    }
  }

  // Remove rows before appending
  await pulseCoreDb.collection(collectionName)
    .deleteMany({
      month: fileMonth,
      year: fileYear,
      project: projectName
    })
    .catch(terminateScript)

  const monthYearProject = `Month: ${fileMonth} Year: ${fileYear} Project: ${projectName}`

  console.log(`Deleted Rows for ${monthYearProject} from pulse-core`)

  await pulseCoreDb.collection(collectionName).insertMany(formattedData)
    .catch(terminateScript)

  console.log(`New data for ${monthYearProject} inserted into pulse-core`)

  pushToDev({
    collectionName,
    pulseCoreDb,
    pulseDevDb,
    terminateScript,
    projectName,
    ignoreConsolidatePayerData,
  })
}

module.exports = importProjectBasedData
