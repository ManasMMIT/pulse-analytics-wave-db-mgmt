// ! EVERYTHING COMMENTED OUT EXCEPT LIVES HISTORY SEED

const connectToMongoDb = require('../connect-to-mongodb')
const _ = require('lodash')

// const cleanQualityAccessPtps = require('./cleanQualityAccessPtps')

// const seedLines = require('./seedLines')
// const seedPopulations = require('./seedPopulation')
// const seedNewIndications = require('./seedNewIndications')
// const seedNewRegimens = require('./seedNewRegimens')

// const seedTreatmentPlans = require('./seedTreatmentPlans')

// const seedOrganizationsTreatmentPlans = require('./seedOrganizationsTreatmentPlans')
// const seedOrganizationsTreatmentPlansHistory = require('./seedOrganizationsTreatmentPlansHistory')

// const seedTdgProjectsCollection = require('./seedTdgProjectsCollection')

const seedLivesCollection = require('./seedLivesCollection')

const runSeedScripts = async () => {
  const dbs = await connectToMongoDb()
  console.log(`Loading historical docs\n`)

  const pulseCore = dbs.db('pulse-core')

  // await cleanQualityAccessPtps(pulseCore)

  const [
    // payerHistoricalQualityAccess,
    // payerHistoricalAdditionalCriteria,
    // payerHistoricalPolicyLinks,
    payerOrganizations,
  ] = await Promise.all([
    // pulseCore.collection('payerHistoricalQualityAccess').find({}).toArray(),
    // pulseCore.collection('payerHistoricalAdditionalCriteria').find({}).toArray(),
    // pulseCore.collection('payerHistoricalPolicyLinks').find({}).toArray(),
    pulseCore.collection('organizations').find({ type: 'Payer' }).toArray(),
  ])

  const payerOrganizationsBySlug = _.keyBy(payerOrganizations, 'slug')

  const seedParameters = {
    pulseCore,
    // payerHistoricalQualityAccess,
    // payerHistoricalAdditionalCriteria,
    // payerHistoricalPolicyLinks,
    payerOrganizationsBySlug,
  }

  console.log(`Historical docs loaded\nBeginning seeding\n`);

  // 1. seed larger sets of treatment plan parts (ones we can't just hard-code like coverages or books)
  // await Promise.all([
  //   seedLines(seedParameters),
  //   seedPopulations(seedParameters),
  // ])

  // // 2. seed actual treatment plan combos
  // await seedTreatmentPlans(seedParameters)

  // await seedOrganizationsTreatmentPlans(seedParameters)

  await seedLivesCollection(seedParameters)

  // await seedOrganizationsTreatmentPlansHistory(seedParameters)

  // await seedTdgProjectsCollection(seedParameters)

  dbs.close()
}

runSeedScripts()
