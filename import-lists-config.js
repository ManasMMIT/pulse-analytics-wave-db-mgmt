const path = require('path')
const parseJson = require('./parse-json')
const _ = require('lodash')
const connectToMongoDb = require('./connect-to-mongodb')

const importListsConfig = async filePath => {
  const dashboardTool = validateFileName(filePath)

  let data = parseJson(filePath)
  data = addDashboardToolAndTimestampToData(data, dashboardTool)

  const db = await connectToMongoDb()

  await updateRawListsConfigCollection(db, dashboardTool, data)
  await updateMasterListsConfig(db, dashboardTool, data)

  console.log('Data finished uploading.')
  process.exit()
}

function validateFileName(filePath) {
  // select the fileName at the end of the filePath
  const fileName = path.basename(filePath)

  const matchResult = fileName.match(/^listsConfig_([A-Za-z]+_[A-Za-z-]+)\.json$/)

  if (!matchResult) {
    console.error('File name is not valid')
    process.exit()
  }

  // select the regex capture group from the match result, which should be in
  // the format `${dashboard}_${tool}`, i.e. `provider_sickle-cell`
  const dashboardTool = matchResult[1]
  console.log(`Key for 'dashboardTool' set to '${dashboardTool}'`)

  return dashboardTool
}

function addDashboardToolAndTimestampToData(data, dashboardTool) {
  const createdOn = new Date()
  return data.map(listConfigObj => ({ ...listConfigObj, dashboardTool, createdOn }))
}

async function updateRawListsConfigCollection(db, dashboardTool, data) {
  // raw data collection name looks like 'providerSickleCellListsConfig'
  const collectionName = _.camelCase(dashboardTool) + 'ListsConfig'
  const rawCollection = db.collection(collectionName)

  // Delete old data by dropping old collection if it exists.
  const listCollectionsResult = await db.listCollections({ name: collectionName }).toArray()
  const doesCollectionExist = listCollectionsResult.length > 0

  // Don't attempt to drop unless collection already exists
  if (doesCollectionExist) {
    await rawCollection.drop()
      .catch(err => {
        console.error(`Error dropping ${collectionName}:`, err)
        process.exit()
      })
  }

 // insert new data (new collection is instantiated on insert if it doesn't exist)
  await rawCollection.insertMany(data)
    .catch(err => {
      console.error(`Data failed to be imported into ${collectionName}`, err)
      process.exit()
    })

  console.log(`Raw data collection '${collectionName}' successfully updated`)
}

async function updateMasterListsConfig(db, dashboardTool, data) {
  const collectionName = 'listsConfig'
  const collection = db.collection(collectionName)

  await collection.deleteMany({ dashboardTool })
    .catch(err => {
      console.error('Error deleting subset of master listsConfig', err)
      process.exit()
    })

  await collection.insertMany(data)
    .catch(err => {
      console.error(`Data failed to be imported into master listsConfig`, err)
      process.exit()
    })

  console.log('Master listsConfig successfully updated')
}

module.exports = importListsConfig
