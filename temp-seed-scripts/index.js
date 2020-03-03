const connectToMongoDb = require('../connect-to-mongodb')

const seedTdgProjectsCollection = require('./seedTdgProjectsCollection')

const runSeedScripts = async () => {
  const dbs = await connectToMongoDb()
  await seedTdgProjectsCollection(dbs)

  dbs.close()
}

runSeedScripts()
