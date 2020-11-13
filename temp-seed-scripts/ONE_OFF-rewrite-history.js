const connectToMongoDb = require('../connect-to-mongodb')
const { ObjectId } = require('mongodb')

const OLD_ACCESS_HISTORY_COLLECTIONS = [
  'payerHistoricalQualityAccess',
  'payerHistoricalQualityAccessHt',
  'payerHistoricalAdditionalCriteria',
  'payerHistoricalAdditionalCriteriaHt',
  'payerHistoricalCombinedData',
]

const rewriteHistory = async () => {
  const dbs = await connectToMongoDb()
  const pulseCoreDb = dbs.db('pulse-core')
  const pulseDevDb = dbs.db('pulse-dev')

  try {
    // await stepOne(pulseCoreDb, pulseDevDb)
    // await stepTwo(pulseCoreDb, pulseDevDb)
    // await stepThree(pulseCoreDb, pulseDevDb)
    await customRequest(pulseCoreDb, pulseDevDb)
  } catch (e) {
    console.log(e)
  } finally {
    await dbs.close()
  }
}

rewriteHistory().then(() => {
  console.log('Script finished')
  process.exit()
})

async function stepOne(pulseCoreDb, pulseDevDb) {
  const TIME_RANGE = { $gte: new Date('2019-03-01T00:00:00.000Z'), $lt: new Date('2020-10-30T00:00:00.000Z') }
  const NEW_AGES_12_PLUS_POPULATION_ID = new ObjectId('5fa1a36b32025c16a9ee98e3')
  const OLD_ADULT_POPULATION_ID = new ObjectId('5ebdb201df6a8090c7a3defe')

  const oldNewTpsWithPtpsPip = [
    {
      '$match': {
        'population': new ObjectId('5fa1a36b32025c16a9ee98e3')
      }
    }, {
      '$lookup': {
        'from': 'treatmentPlans',
        'as': 'oldTp',
        'let': {
          'book': '$book',
          'coverage': '$coverage',
          'indication': '$indication',
          'line': '$line',
          'regimen': '$regimen'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$population', new ObjectId('5ebdb201df6a8090c7a3defe')
                    ]
                  }, {
                    '$eq': [
                      '$$book', '$book'
                    ]
                  }, {
                    '$eq': [
                      '$$coverage', '$coverage'
                    ]
                  }, {
                    '$eq': [
                      '$$indication', '$indication'
                    ]
                  }, {
                    '$eq': [
                      '$$line', '$line'
                    ]
                  }, {
                    '$eq': [
                      '$regimen', '$$regimen'
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    }, {
      '$project': {
        '_id': 0,
        'newTpId': '$_id',
        'oldTp': {
          '$arrayElemAt': [
            '$oldTp', 0
          ]
        }
      }
    }, {
      '$lookup': {
        'from': 'organizations.treatmentPlans',
        'localField': 'oldTp._id',
        'foreignField': 'treatmentPlanId',
        'as': 'oldPtps'
      }
    }, {
      '$unwind': {
        'path': '$oldPtps'
      }
    }, {
      '$project': {
        'newTpId': 1,
        'oldPtpId': '$oldPtps._id',
        'orgId': '$oldPtps.organizationId',
        'oldTpId': '$oldPtps.treatmentPlanId'
      }
    }, {
      '$lookup': {
        'from': 'organizations.treatmentPlans',
        'as': 'newPtp',
        'let': {
          'treatmentPlanId': '$newTpId',
          'organizationId': '$orgId'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$and': [
                  {
                    '$eq': [
                      '$$organizationId', '$organizationId'
                    ]
                  }, {
                    '$eq': [
                      '$$treatmentPlanId', '$treatmentPlanId'
                    ]
                  }
                ]
              }
            }
          }
        ]
      }
    }, {
      '$match': {
        'newPtp.0': {
          '$exists': true
        }
      }
    }, {
      '$project': {
        'oldPtpId': 1,
        'newPtp': {
          '$arrayElemAt': [
            '$newPtp', 0
          ]
        }
      }
    }
  ]

  // Get map docs with old ptp ids and new ptp docs
  const oldPtpsWithNewPtps = await pulseCoreDb.collection('treatmentPlans')
    .aggregate(oldNewTpsWithPtpsPip, { allowDiskUse: true }).toArray()

  const updateOps = oldPtpsWithNewPtps.map(async ({
    oldPtpId,
    newPtp: {
      _id: newPtpId,
      treatmentPlanId: newTreatmentPlanId,
    },
  }) => {
    // For each map doc, update old ptps/tpId refs in history during desired time range
    await pulseCoreDb.collection('organizations.treatmentPlans.history')
      .updateMany(
        {
          orgTpId: oldPtpId,
          timestamp: TIME_RANGE,
        },
        {
          $set: {
            orgTpId: newPtpId,
            treatmentPlanId: newTreatmentPlanId,
          }
        }
      )

    // For each map doc, update old ptps/tpId refs in history during desired time range
    await pulseDevDb.collection('payerHistoricalAccess').updateMany(
      {
        orgTpId: oldPtpId,
        timestamp: TIME_RANGE,
      },
      {
        $set: {
          orgTpId: newPtpId,
          treatmentPlanId: newTreatmentPlanId,
          population: 'Ages 12+',
        }
      }
    )

    await pulseDevDb.collection('payerLatestAccess').updateMany(
      {
        orgTpId: oldPtpId,
        timestamp: TIME_RANGE,
      },
      {
        $set: {
          orgTpId: newPtpId,
          treatmentPlanId: newTreatmentPlanId,
          population: 'Ages 12+',
        }
      }
    )
  })

  await Promise.all(updateOps)

  const oldAccessHistoryUpdateOps = OLD_ACCESS_HISTORY_COLLECTIONS.map(async (collection) => {
    return pulseDevDb.collection(collection).updateMany(
      {
        indication: "Atopic Dermatitis",
        regimen: "Dupixent",
        population: "Adult",
        coverage: 'Pharmacy',
        timestamp: TIME_RANGE,
      },
      {
        $set: {
          population: 'Ages 12+',
        }
      }
    )
  })

  await Promise.all(oldAccessHistoryUpdateOps)
}

async function stepTwo(pulseCoreDb, pulseDevDb) {
  const TIME_RANGE = { $gte: new Date('2020-10-01T00:00:00.000Z'), $lte: new Date('2020-10-31T00:00:00.000Z') }
  /*
    {
      indication: 'Atopic Dermatitis',
      population: 'Adolescent',
      regimen: 'Dupixent',
      coverage: 'Pharmacy',
      book: ANY_BOOK,
      slug: ANY_SLUG,
    }
  */
  const treatmentPlanDocs = await pulseCoreDb.collection('treatmentPlans').find({
    indication: ObjectId('5d6fa1f73b53cf87ec5076e1'),
    regimen: ObjectId('5d711733a317759f67e6e578'),
    population: ObjectId('5ebdb201df6a8090c7a3df0b'),
    coverage: ObjectId('5ebdafc81594eb3c26f4d563')
  }).toArray()

  const treatmentPlanIds = treatmentPlanDocs.map(({ _id }) => _id)

  // ? Confirm w/ chuck
  // await pulseCoreDb.collection('organizations.treatmentPlans').deleteMany(
  //   {
  //     timestamp: TIME_RANGE,
  //     treatmentPlanId: {
  //       $in: treatmentPlanIds,
  //     }
  //   }
  // )

  await pulseDevDb.collection('payerHistoricalAccess').deleteMany(
    {
      timestamp: TIME_RANGE,
      treatmentPlanId: {
        $in: treatmentPlanIds,
      }
    }
  )

  await pulseDevDb.collection('payerLatestAccess').deleteMany(
    {
      timestamp: TIME_RANGE,
      treatmentPlanId: {
        $in: treatmentPlanIds,
      }
    }
  )

  const oldAccessHistoryDeleteOps = OLD_ACCESS_HISTORY_COLLECTIONS.map(async (collection) => {
    return pulseDevDb.collection(collection).deleteMany(
      {
        indication: 'Atopic Dermatitis',
        population: 'Adolescent',
        regimen: 'Dupixent',
        coverage: 'Pharmacy',
        timestamp: TIME_RANGE,
      }
    )
  })

  await Promise.all(oldAccessHistoryDeleteOps)
}

const stepThree = async (pulseCoreDb, pulseDevDb) => {
  const oldAccessHistoryDeleteOps = OLD_ACCESS_HISTORY_COLLECTIONS.map(async (collection) => {
    return pulseDevDb.collection(collection).deleteMany(
      {
        indication: 'Atopic Dermatitis',
        population: 'Adolescent',
        regimen: 'Dupixent',
        coverage: 'Pharmacy',
      }
    )
  })

    await Promise.all(oldAccessHistoryDeleteOps)
}

const customRequest = async (pulseCoreDb, pulseDevDb) => {
  const AAA_PROJECT_ID = ObjectId('5f5fcb64b0d029634bc87d41')
  const TIMESTAMP = new Date('2020-11-05T05:00:00.000+00:00')
  const findObj = { projectId: AAA_PROJECT_ID, timestamp: TIMESTAMP }
  // 1. test new date gets all 784 ptps in production cluster
  const ptpsToDelete = await pulseCoreDb.collection('organizations.treatmentPlans.history')
    .aggregate([
      {
        '$match': findObj
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
        '$project': {
          'orgTpId': 1,
          'timestamp': 1,
          'organization': {
            '$arrayElemAt': [
              '$organization', 0
            ]
          },
          'treatmentPlan': {
            '$arrayElemAt': [
              '$treatmentPlan', 0
            ]
          }
        }
      }, {
        '$project': {
          'orgTpId': 1,
          'timestamp': 1,
          'slug': '$organization.slug',
          'book': '$treatmentPlan.book',
          'coverage': '$treatmentPlan.coverage',
          'indication': '$treatmentPlan.indication',
          'regimen': '$treatmentPlan.regimen',
          'line': '$treatmentPlan.line',
          'population': '$treatmentPlan.population'
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
        '$addFields': {
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
          'line': {
            '$arrayElemAt': [
              '$line', 0
            ]
          },
          'population': {
            '$arrayElemAt': [
              '$population', 0
            ]
          }
        }
      }, {
        '$addFields': {
          'book': '$book.name',
          'coverage': '$coverage.name',
          'indication': '$indication.name',
          'regimen': '$regimen.name',
          'population': '$population.name',
          'line': '$line.name'
        }
      }
    ])
    .toArray()

  // 2. make sure you have all info from ptps needed to delete from all access history collections.
  debugger

  const orgTpIdsToDelete = ptpsToDelete.map(({ orgTpId }) => orgTpId)

  await pulseDevDb.collection('payerHistoricalAccess').deleteMany({
    orgTpId: { $in: orgTpIdsToDelete },
    timestamp: TIMESTAMP,
  })

  await pulseDevDb.collection('payerLatestAccess').deleteMany({
    orgTpId: { $in: orgTpIdsToDelete },
    timestamp: TIMESTAMP,
  })

  const ptpCombos = ptpsToDelete.map(({ slug, book, coverage, population, line, indication, regimen }) => ({
    slug, book, coverage, population, line, indication, regimen
  }))

  const oldAccessHistoryDeleteOps = OLD_ACCESS_HISTORY_COLLECTIONS.map(async (collection) => {
    return pulseDevDb.collection(collection).deleteMany({
        $or: ptpCombos,
        timestamp: TIMESTAMP,
      })
  })

  await Promise.all(oldAccessHistoryDeleteOps)

  const POLICY_LINK_COLLECTIONS = [
    'payerHistoricalPolicyLinks',
    'payerHistoricalPolicyLinksHt',
  ]

  const ptpPolicyCombos = ptpCombos.map(({ line, population, indication, ...rest }) => rest)
  const POLICY_oldAccessHistoryDeleteOps = POLICY_LINK_COLLECTIONS.map(async (collection) => {
    return pulseDevDb.collection(collection).deleteMany(
      {
        $or: ptpPolicyCombos,
        timestamp: TIMESTAMP,
      })
  })

  await Promise.all(POLICY_oldAccessHistoryDeleteOps)

  await pulseCoreDb.collection('organizations.treatmentPlans.history').deleteMany(findObj)
}
