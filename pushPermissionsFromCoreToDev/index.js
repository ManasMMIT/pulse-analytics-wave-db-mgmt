const connectToMongoDb = require('../connect-to-mongodb')
const aggregationPipeline = require('./aggregation-pipeline')

const pushPermissionsFromCoreToDev = async () => {
  const mongoConnection = await connectToMongoDb()
  const pulseCoreDb = await mongoConnection.db('pulse-core')
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  // manipulate permissions in pulse-core DB (entry point, dashboards)
  const usersDashboards = await pulseCoreDb.collection('dashboards')
    .aggregate(aggregationPipeline).toArray()
    .catch(err => {
      console.error('Error aggregating permissions data from pulse-core:', err)
      process.exit()
    })


  // push formatted data to pulse-dev

  // Drop outcome collection if it exists before importing new data.
  const TARGET_COLLECTION = 'users.dashboards'

  const listCollectionsResult = await pulseDevDb
    .listCollections({ name: TARGET_COLLECTION })
    .toArray()

  const doesCollectionExist = listCollectionsResult.length > 0

  // Don't attempt to drop unless collection already exists
  if (doesCollectionExist) {
    // If drop is successful, #drop returns true
    const didDrop = await pulseDevDb.collection(TARGET_COLLECTION).drop()
      .then(res => {
        if (res) console.log(`Successfully dropped existing collection '${TARGET_COLLECTION}'`)
        return res
      })
      .catch(err => {
        console.error('Error dropping existing collection, terminating import:', err)
      })

    // Exit the import process if the drop failed
    if (!didDrop) return
  }

  await pulseDevDb.collection(TARGET_COLLECTION)
    .insertMany(usersDashboards)
    .catch(err => {
      console.error('Error pushing collection to pulse-dev:', err)
      process.exit()
    })
    .then(console.log)

  console.log('Script finished.')

  await mongoConnection.close()
  process.exit()
}

pushPermissionsFromCoreToDev()
