const _ = require('lodash')
const connectToMongoDb = require('../../connect-to-mongodb')
const parseCsvFileAndWriteToDb = require('../parse-csv-file-and-write-to-db')
const pushToDev = require('./pushToDev')
const {
  getScriptTerminator,
  verifyCollectionExists
} = require('../../utils')

const importProjectBasedData = async filepath => {
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

  // Remove rows before appending
  await pulseCoreDb.collection(collectionName)
    .deleteMany({
      month: fileMonth,
      year: fileYear,
      project: projectName
    })
    .catch(async err => await terminateScript(err))


  const monthYearProject = `Month: ${fileMonth} Year: ${fileYear} Project: ${projectName}`

  console.log(`Deleted Rows for ${monthYearProject} from pulse-core`)

  await parseCsvFileAndWriteToDb({
    db: pulseCoreDb,
    filepath,
    projectName,
    collectionName,
    fileMonth,
    fileYear,
  }).catch(async err => await terminateScript(err))

  console.log(`New data for ${monthYearProject} inserted into pulse-core`)

  pushToDev({
    collectionName,
    pulseCoreDb,
    pulseDevDb,
    terminateScript
  })
}

module.exports = importProjectBasedData
