const connectToMongoDb = require('../connect-to-mongodb')
// const _ = require('lodash')

const seedBooks = require('./seedBooks')
const seedLines = require('./seedLines')
const seedPopulations = require('./seedPopulation')
const seedCoverages = require('./seedCoverages')
// const seedNewIndications = require('./seedNewIndications')
// const seedNewRegimens = require('./seedNewRegimens')

const seedTreatmentPlans = require('./seedTreatmentPlans')

const seedOrganizationsTreatmentPlans = require('./seedOrganizationsTreatmentPlans')
const seedOrganizationsTreatmentPlansHistory = require('./seedOrganizationsTreatmentPlansHistory')

const seedTdgProjectsCollection = require('./seedTdgProjectsCollection')

const runSeedScripts = async () => {
  const dbs = await connectToMongoDb()
  console.log(`Loading historical docs\n`);
  
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

  const seedParameters = {
    pulseCore,
    payerHistoricalQualityAccess,
    payerHistoricalAdditionalCriteria,
    payerHistoricalPolicyLinks,
  }

  console.log(`Historical docs loaded\nBeginning seeding\n`);
  
  // 1. seed all treatment plan parts
  await Promise.all([
    seedBooks(seedParameters),
    seedLines(seedParameters),
    seedPopulations(seedParameters),
    seedCoverages(seedParameters),
  ])

  // 2. seed actual treatment plan combos
  await seedTreatmentPlans(seedParameters)

  await seedOrganizationsTreatmentPlans(seedParameters)
  await seedOrganizationsTreatmentPlansHistory(seedParameters)

  await seedTdgProjectsCollection(seedParameters)

  dbs.close()
}

runSeedScripts()
