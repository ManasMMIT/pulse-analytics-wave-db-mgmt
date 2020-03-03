const connectToMongoDb = require('../connect-to-mongodb')

// const seedBooks = require('./seedBooks')
const seedLines = require('./seedLines')
// const seedTdgProjectsCollection = require('./seedTdgProjectsCollection')

const runSeedScripts = async () => {
  const dbs = await connectToMongoDb()
  const pulseCore = dbs.db('pulse-core')

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

  // await seedBooks({
  //   pulseCore,
  //   payerHistoricalQualityAccess,
  //   payerHistoricalAdditionalCriteria,
  //   payerHistoricalPolicyLinks,
  // })

  seedLines({
    pulseCore,
    payerHistoricalQualityAccess,
    payerHistoricalAdditionalCriteria,
    payerHistoricalPolicyLinks,
  })

  // await seedTdgProjectsCollection({
  //   dbs,
  //   pulseCore,
  //   payerHistoricalQualityAccess,
  //   payerHistoricalAdditionalCriteria,
  //   payerHistoricalPolicyLinks,
  // })

  dbs.close()
}

runSeedScripts()
