const connectToMongoDb = require('../connect-to-mongodb')
const getQualityAccessDiffDocs = require('./qualityAccess')
const getAdditionalCriteriaDiffDocs = require('./additionalCriteria')
const getPolicyLinkDiffDocs = require('./policyLinks')

const getCombinedDataDocs = require('./combinedData')
// const getCombinedStateLivesDocs = require('./combinedStateLives')

const runDiffer = async () => {
  const dbs = await connectToMongoDb()
  const pulseDev = dbs.db('pulse-dev')

  await dbs.db('pulse-core')
    .collection('aBHistoricalDiffsAll')
    .deleteMany()

  await dbs.db('pulse-core')
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
  ] = await getQualityAccessDiffDocs(pulseDev)

  const [
    {
      simpleDiff: additionalCriteriaSimpleDiff,
      diff: additionalCriteriaDiff
    },
    {
      simpleDiff: additionalCriteriaHtSimpleDiff,
      diff: additionalCriteriaHtDiff
    },
  ] = await getAdditionalCriteriaDiffDocs(pulseDev)

  const [
    {
      simpleDiff: policyLinkSimpleDiff,
      diff: policyLinkDiff
    },
    {
      simpleDiff: policyLinkHtSimpleDiff,
      diff: policyLinkHtDiff
    },
  ] = await getPolicyLinkDiffDocs(pulseDev)

  const {
    simpleDiff: combinedDataSimpleDiff,
    diff: combinedDataDiff,
  } = await getCombinedDataDocs(pulseDev)

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

  debugger

  await dbs.db('pulse-core')
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

    await dbs.db('pulse-core')
      .collection('aBHistoricalDiffsAll')
      .insertOne(diffDoc)
  }

  console.log('DONE')

  dbs.close()
}

runDiffer()
