const connectToMongoDb = require('../connect-to-mongodb')
const aggregationPipeline = require('./aggregation-pipeline')
const {
  getScriptTerminator,
  verifyCollectionExists
} = require('../utils')

const pushPermissionsFromCoreToDev = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseCoreDb = await mongoConnection.db('pulse-core')
  const pulseDevDb = await mongoConnection.db('pulse-dev')

  // Step 1: manipulate permissions in pulse-core DB (entry point, users)
  const usersDashboards = await pulseCoreDb.collection('users')
    .aggregate(aggregationPipeline).toArray()
    .catch(async err => {
      await terminateScript('Error aggregating permissions data from pulse-core:', err)
    })

  // Step 2: push formatted data to pulse-dev
  const TARGET_COLLECTION = 'users.dashboards'
  await verifyCollectionExists(TARGET_COLLECTION, pulseDevDb, mongoConnection)

  // Drop outcome collection if it exists before importing new data.
  // Terminate the script if anything goes wrong with the drop
  await pulseDevDb.collection(TARGET_COLLECTION).drop()
    .then(res => {
      if (res) console.log(`Successfully dropped existing collection '${TARGET_COLLECTION}'`)
      return res
    })
    .catch(async err => {
      await terminateScript('Error dropping existing collection, terminating import:', err)
    })

  // Insert the usersDashboards data into target collection
  await pulseDevDb.collection(TARGET_COLLECTION)
    .insertMany(usersDashboards)
    .catch(async err => {
      await terminateScript('Error pushing collection to pulse-dev:', err)
    })
    .then(console.log)
    .finally(async () => {
      console.log('Script finished.')
      await terminateScript()
    })
}

pushPermissionsFromCoreToDev()
