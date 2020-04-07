require('dotenv').config()
const MONGO_KEY = process.env.MONGO_KEY
const MongoClient = require('mongodb').MongoClient
const getQualityAccessDiffDocs = require('./qualityAccess')
const getAdditionalCriteriaDiffDocs = require('./additionalCriteria')
const getPolicyLinkDiffDocs = require('./policyLinks')
const getGetDiffDocFunc = require('./getGetDiffDocFunc')
const _ = require('lodash')

const getCombinedDataDocs = require('./combinedData')
// const getCombinedStateLivesDocs = require('./combinedStateLives')

const runDiffer = async () => {
  const stagingDbs = await MongoClient.connect(`mongodb://pulse-admin:${MONGO_KEY}@wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-staging-shard-0&authSource=admin`, { useNewUrlParser: true })
  const testDbs = await MongoClient.connect(`mongodb+srv://pulse-admin:${MONGO_KEY}@wave-test.ik4h2.mongodb.net/pulse-dev?retryWrites=true&w=majority`, { useNewUrlParser: true })

  const pulseDevStaging = stagingDbs.db('pulse-dev')
  const pulseDevTest = testDbs.db('pulse-dev')

  const pulseCoreStaging = stagingDbs.db('pulse-core')

  const [
    organizations,
    indications,
    regimens,
    lines,
    populations,
    books,
    coverages,
    treatmentPlans,
  ] = await Promise.all([
    pulseCoreStaging.collection('organizations').find({ type: 'Payer' }).toArray(),
    pulseCoreStaging.collection('indications').find().toArray(),
    pulseCoreStaging.collection('regimens').find().toArray(),
    pulseCoreStaging.collection('lines').find().toArray(),
    pulseCoreStaging.collection('populations').find().toArray(),
    pulseCoreStaging.collection('books').find().toArray(),
    pulseCoreStaging.collection('coverages').find().toArray(),
    pulseCoreStaging.collection('treatmentPlans').find().toArray(),
  ])

  const validSlugs = _.keyBy(organizations, 'slug')
  const invalidSlugs = {}

  const validIndications = _.keyBy(indications, 'name')
  const invalidIndications = {}

  const validRegimens = _.keyBy(regimens, 'name')
  const invalidRegimens = {}

  const validLines = _.keyBy(lines, 'name')
  const invalidLines = {}

  const validPopulations = _.keyBy(populations, 'name')
  const invalidPopulations = {}

  const validBooks = _.keyBy(books, 'name')
  const invalidBooks = {}

  const validCoverages = _.keyBy(coverages, 'name')
  const invalidCoverages = {}

  const getDiffDoc = getGetDiffDocFunc({
    validSlugs,
    invalidSlugs,
    validIndications,
    invalidIndications,
    validRegimens,
    invalidRegimens,
    validLines,
    invalidLines,
    validPopulations,
    invalidPopulations,
    validBooks,
    invalidBooks,
    validCoverages,
    invalidCoverages,
    treatmentPlans,
    dbs: {
      pulseDevStaging,
      pulseDevTest,
    },
  })

  await pulseDevStaging
    .collection('aBHistoricalDiffsAll')
    .deleteMany()

  await pulseDevStaging
    .collection('aBHistoricalDiffs')
    .deleteMany()

  const [
    {
      simpleDiff: qualityAccessSimpleDiff,
      diff: qualityAccessDiff
    },
    {
      simpleDiff: qualityAccessHtSimpleDiff,
      diff: qualityAccessHtDiff
    },
  ] = await getQualityAccessDiffDocs(getDiffDoc)

  const [
    {
      simpleDiff: additionalCriteriaSimpleDiff,
      diff: additionalCriteriaDiff
    },
    {
      simpleDiff: additionalCriteriaHtSimpleDiff,
      diff: additionalCriteriaHtDiff
    },
  ] = await getAdditionalCriteriaDiffDocs(getDiffDoc)

  const [
    {
      simpleDiff: policyLinkSimpleDiff,
      diff: policyLinkDiff
    },
    {
      simpleDiff: policyLinkHtSimpleDiff,
      diff: policyLinkHtDiff
    },
  ] = await getPolicyLinkDiffDocs(getDiffDoc)

  const {
    simpleDiff: combinedDataSimpleDiff,
    diff: combinedDataDiff,
  } = await getCombinedDataDocs(getDiffDoc)

  // ! op is too big and blows up
  // const {
  //   simpleDiff: combinedStateLivesSimpleDiff,
  //   diff: combinedStateLivesDiff,
  // } = await getCombinedStateLivesDocs(pulseDev)

  const simpleDiffDocs = [
    qualityAccessSimpleDiff,
    qualityAccessHtSimpleDiff,
    additionalCriteriaSimpleDiff,
    additionalCriteriaHtSimpleDiff,
    policyLinkSimpleDiff,
    policyLinkHtSimpleDiff,
    combinedDataSimpleDiff,
    // combinedStateLivesSimpleDiff,
  ]

  await pulseDevStaging
    .collection('aBHistoricalDiffs')
    .insertMany(simpleDiffDocs)

  const diffDocs = [
    qualityAccessDiff,
    qualityAccessHtDiff,
    additionalCriteriaDiff,
    additionalCriteriaHtDiff,
    policyLinkDiff,
    policyLinkHtDiff,
    combinedDataDiff,
    // combinedStateLivesDiff,
  ]

  // ! scared of writing too much at once,
  // so writing synchronously

  for (let i = 0; i < diffDocs.length; i++) {
    const diffDoc = diffDocs[i]

    await pulseDevStaging
      .collection('aBHistoricalDiffsAll')
      .insertOne(diffDoc)
  }

  console.log('DONE')

  debugger

  await stagingDbs.close()
  await testDbs.close()

  console.log('dbs connections closed')
}

runDiffer()
