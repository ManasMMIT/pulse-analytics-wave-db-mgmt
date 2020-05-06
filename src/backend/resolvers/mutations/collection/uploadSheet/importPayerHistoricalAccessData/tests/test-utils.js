const connectToMongoDb = require('../../../../../../../../connect-to-mongodb')
const { getScriptTerminator } = require('../../../../../../../../utils')
const {
  mockOrgTps,
  TEST_COLLECTION_NAME,
} = require('./importPayerHistoricalAccessData.mocks')

const testSetup = db => {
  console.log('Setting up collections')
  
  return db.collection(TEST_COLLECTION_NAME)
    .insertMany(mockOrgTps)
}

const clearTestCollections = db => {
  console.log('Deleting data in test collection(s) if they exist)')
  return db.collection(TEST_COLLECTION_NAME).deleteMany()
}

const dropTestCollections = db => {
  console.log('Teardown: Removing collection(s)...')
  return db.collection(TEST_COLLECTION_NAME).drop()
}

const testContainer = async (runTest) => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)
  const pulseCoreDb = await mongoConnection.db('pulse-core')

  try {
    // Delete data in test collection(s) in case they exist
    await clearTestCollections(pulseCoreDb)

    // Setup project docs
    await testSetup(pulseCoreDb)
    await runTest(pulseCoreDb)

  } catch (e) {
    console.error(e)
  } finally {
    await dropTestCollections(pulseCoreDb)
      .finally(async () => await terminateScript())
  }
}

const runDbOps = async (sheetManager) => {
  await sheetManager.setupHashes()
  let permittedOps = await sheetManager.getPermittedOps()

  return Promise.all(
    permittedOps
      .map(({ findObj, setObj }) => {
        const result = sheetManager.pulseCore
          .collection(TEST_COLLECTION_NAME)
          .updateOne(findObj, setObj, { upsert: true })

        return result
      })
  )
}

const SHEET_NAMES = {
  qoa: 'Quality of Access',
  ac: 'Additional Criteria',
  pl: 'Policy Links'
}

module.exports = {
  runDbOps,
  SHEET_NAMES,
  testContainer,
}
