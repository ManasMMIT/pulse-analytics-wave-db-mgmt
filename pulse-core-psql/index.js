const connectToMongoDb = require('../connect-to-mongodb')
const { getScriptTerminator } = require('../utils')
const generateDataForMongoDb = require('./generate-data-for-mongodb')

const pushPsqlDataToMongoDb = async () => {
  const mongoConnection = await connectToMongoDb()
  const terminateScript = getScriptTerminator(mongoConnection)

  const pulseDevDb = await mongoConnection.db('pulse-dev')

  try {
    const {
      usersContentsResources,
      usersSitemaps,
    } = await generateDataForMongoDb()

    // Remove existing collections if they exist
    await pulseDevDb.collection('users.sitemaps')
      .deleteMany()

    await pulseDevDb.collection('users.contents.resources')
      .deleteMany()

    // insert new data
    await pulseDevDb.collection('users.sitemaps')
      .insertMany(usersSitemaps)

    await pulseDevDb.collection('users.contents.resources')
      .insertMany(usersContentsResources)

    console.log('All psql data successfully inserted into MongoDB.')
  } catch (e) {
    console.error(e)
  } finally {
    await terminateScript()
  }
}

pushPsqlDataToMongoDb()
