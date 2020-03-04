const connectToMongoDb = require('../connect-to-mongodb')

const seedBooks = require('./seedBooks')
const seedLines = require('./seedLines')
const seedPopulations = require('./seedPopulation')
const seedCoverages = require('./seedCoverages')
const seedNewIndications = require('./seedNewIndications')
const seedNewRegimens = require('./seedNewRegimens')

const seedTreatmentPlans = require('./seedTreatmentPlans')

const seedOrganizationsTreatmentPlans = require('./seedOrganizationsTreatmentPlans')
const seedOrganizationsTreatmentPlansHistory = require('./seedOrganizationsTreatmentPlansHistory')

// const seedTdgProjectsCollection = require('./seedTdgProjectsCollection')

const runSeedScripts = async () => {
  const dbs = await connectToMongoDb()
  console.log(`Loading historical docs\n`);
  
  const pulseCore = dbs.db('pulse-core')

  // check missing ind and reg btwn master lists and historical data
  // const historicalRegimens = await pulseCore.collection('regimensFromHistoricalData').find().toArray()
  // const historicalIndications = await pulseCore.collection('indicationsFromHistoricalData').find().toArray()

  // const masterListRegimens = await pulseCore.collection('regimens').find().toArray()
  // const masterListIndications = await pulseCore.collection('indications').find().toArray()

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
    seedNewIndications(seedParameters),
    seedNewRegimens(seedParameters),
  ])

  // 2. seed actual treatment plan combos
  await seedTreatmentPlans(seedParameters)

  await seedOrganizationsTreatmentPlans(seedParameters)
  await seedOrganizationsTreatmentPlansHistory(seedParameters)

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
