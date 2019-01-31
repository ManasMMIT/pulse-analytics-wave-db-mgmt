const _ = require('lodash')

const updateRawListsConfigCollection = async (db, dashboardTool, data) => {
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

module.exports = updateRawListsConfigCollection
