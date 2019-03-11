const {
  validateFileName,
  addDashboardToolAndTimestampToData
} = require('./utils')
const parseJson = require('../parse-json')
const connectToMongoDb = require('../connect-to-mongodb')
const updateRawListsConfigCollection = require('./update-raw-collection')
const updateMasterListsConfig = require('./update-master-listsConfig')

const importListsConfig = async filePath => {
  const dashboardTool = validateFileName(filePath)

  let data = parseJson(filePath)
  data = addDashboardToolAndTimestampToData(data, dashboardTool)

  const mongoConnection = await connectToMongoDb()
  const db = await mongoConnection.db('pulse-dev')

  await updateRawListsConfigCollection(db, dashboardTool, data)
  await updateMasterListsConfig(db, dashboardTool, data)

  console.log('Data finished uploading.')

  await mongoConnection.close()
  process.exit()
}

module.exports = importListsConfig
