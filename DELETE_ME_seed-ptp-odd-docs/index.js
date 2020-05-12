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
  const stagingDbs = await MongoClient.connect(`mongodb://pulse-admin:${MONGO_KEY}@wave-staging-shard-00-00-ik4h2.mongodb.net:27017,wave-staging-shard-00-01-ik4h2.mongodb.net:27017,wave-staging-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-staging-shard-0&authSource=admin`, { useUnifiedTopology: true })
  const controlDbs = await MongoClient.connect(`mongodb://pulse-admin:${MONGO_KEY}@wave-shard-00-00-ik4h2.mongodb.net:27017,wave-shard-00-01-ik4h2.mongodb.net:27017,wave-shard-00-02-ik4h2.mongodb.net:27017/pulse-dev?ssl=true&replicaSet=wave-shard-0&authSource=admin`, { useUnifiedTopology: true })

  const pulseDevStaging = stagingDbs.db('pulse-dev')
  const pulseDevControl = controlDbs.db('pulse-dev')

  const pulseCoreStaging = stagingDbs.db('pulse-core')

  console.log('Loading diffing data')
  const [
    organizations,
    indications,
    regimens,
    lines,
    populations,
    books,
    coverages,
    treatmentPlans,
    allowedPolicyLinkNotches,
  ] = await Promise.all([
    pulseCoreStaging.collection('organizations').find({ type: 'Payer' }).toArray(),
    pulseCoreStaging.collection('indications').find().toArray(),
    pulseCoreStaging.collection('regimens').find().toArray(),
    pulseCoreStaging.collection('lines').find().toArray(),
    pulseCoreStaging.collection('populations').find().toArray(),
    pulseCoreStaging.collection('books').find().toArray(),
    pulseCoreStaging.collection('coverages').find().toArray(),
    pulseCoreStaging.collection('treatmentPlans').aggregate([
      {
        '$lookup': {
          'from': 'indications',
          'localField': 'indication',
          'foreignField': '_id',
          'as': 'indication'
        }
      }, {
        '$lookup': {
          'from': 'regimens',
          'localField': 'regimen',
          'foreignField': '_id',
          'as': 'regimen'
        }
      }, {
        '$lookup': {
          'from': 'lines',
          'localField': 'line',
          'foreignField': '_id',
          'as': 'line'
        }
      }, {
        '$lookup': {
          'from': 'populations',
          'localField': 'population',
          'foreignField': '_id',
          'as': 'population'
        }
      }, {
        '$lookup': {
          'from': 'books',
          'localField': 'book',
          'foreignField': '_id',
          'as': 'book'
        }
      }, {
        '$lookup': {
          'from': 'coverages',
          'localField': 'coverage',
          'foreignField': '_id',
          'as': 'coverage'
        }
      }, {
        '$project': {
          'indication': {
            '$arrayElemAt': [
              '$indication', 0
            ]
          },
          'regimen': {
            '$arrayElemAt': [
              '$regimen', 0
            ]
          },
          'population': {
            '$arrayElemAt': [
              '$population', 0
            ]
          },
          'line': {
            '$arrayElemAt': [
              '$line', 0
            ]
          },
          'book': {
            '$arrayElemAt': [
              '$book', 0
            ]
          },
          'coverage': {
            '$arrayElemAt': [
              '$coverage', 0
            ]
          }
        }
      }, {
        '$project': {
          'indication': '$indication.name',
          'regimen': '$regimen.name',
          'population': '$population.name',
          'line': '$line.name',
          'book': '$book.name',
          'coverage': '$coverage.name'
        }
      }
    ]).toArray(),
    pulseCoreStaging.collection('organizations.treatmentPlans.history')
      .aggregate([
        {
          '$addFields': {
            'dateParts': {
              '$dateToParts': {
                'date': '$timestamp'
              }
            }
          }
        }, {
          '$lookup': {
            'from': 'organizations',
            'localField': 'organizationId',
            'foreignField': '_id',
            'as': 'organization'
          }
        }, {
          '$lookup': {
            'from': 'treatmentPlans',
            'localField': 'treatmentPlanId',
            'foreignField': '_id',
            'as': 'treatmentPlan'
          }
        }, {
          '$lookup': {
            'from': 'regimens',
            'localField': 'treatmentPlan.regimen',
            'foreignField': '_id',
            'as': 'regimen'
          }
        }, {
          '$lookup': {
            'from': 'books',
            'localField': 'treatmentPlan.book',
            'foreignField': '_id',
            'as': 'book'
          }
        }, {
          '$lookup': {
            'from': 'coverages',
            'localField': 'treatmentPlan.coverage',
            'foreignField': '_id',
            'as': 'coverage'
          }
        }, {
          '$addFields': {
            'regimen': {
              '$arrayElemAt': [
                '$regimen', 0
              ]
            },
            'book': {
              '$arrayElemAt': [
                '$book', 0
              ]
            },
            'coverage': {
              '$arrayElemAt': [
                '$coverage', 0
              ]
            },
            'organization': {
              '$arrayElemAt': [
                '$organization', 0
              ]
            }
          }
        }, {
          '$addFields': {
            'regimen': '$regimen.name',
            'book': '$book.name',
            'coverage': '$coverage.name',
            'slug': '$organization.slug'
          }
        }, {
          '$group': {
            '_id': {
              'timestamp': '$timestamp',
              'book': '$book',
              'coverage': '$coverage',
              'regimen': '$regimen',
              'slug': '$slug',
              'month': '$dateParts.month',
              'year': '$dateParts.year'
            },
            'data': {
              '$push': '$$ROOT'
            }
          }
        }, {
          '$replaceRoot': {
            'newRoot': '$_id'
          }
        }
      ], { allowDiskUse: true }).toArray(),
  ])
console.log('done loading diffing data')
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
    allowedPolicyLinkNotches,
    dbs: {
      pulseDevStaging,
      pulseDevControl,
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
  await controlDbs.close()

  console.log('dbs connections closed')
}

runDiffer()
