const connectToMongoDb = require('../connect-to-mongodb')

const seedTdgProjectsCollection = require('./seedTdgProjectsCollection')

const runSeedScripts = async () => {
  const dbs = await connectToMongoDb()
  const pulseCore = dbs.collection('pulse-core')

  const payerHistoricalQualityAccess = await pulseCore
    .collection('payerHistoricalQualityAccess')
    .find({})
    .toArray()

  const payerHistoricalAdditionalCriteria = await pulseCore
    .collection('payerHistoricalAdditionalCriteria')
    .find({})
    .toArray()

  const payerHistoricalPolicyLinks = await pulseCore
    .collection('payerHistoricalPolicyLinks')
    .find({})
    .toArray()

  await seedTdgProjectsCollection({
    dbs,
    payerHistoricalQualityAccess,
    payerHistoricalAdditionalCriteria,
    payerHistoricalPolicyLinks,
  })

  dbs.close()
}

runSeedScripts()
