const connectToMongoDb = require('../connect-to-mongodb')
const { ObjectId } = require('mongodb')

const OLD_ACCESS_HISTORY_COLLECTIONS = [
  'payerHistoricalQualityAccess',
  'payerHistoricalQualityAccessHt',
  'payerHistoricalAdditionalCriteria',
  'payerHistoricalAdditionalCriteriaHt',
  'payerHistoricalCombinedData',
]

/*
  ! PLAN OF ATTACK !

  Step 1:
  A. Update history with new ptp, tpIds, stripping a section of time of treatment plans with "Adult" population
  B. Update materialized collection for same time period and ptpIds, replacing hydrated population string

  Step 2:
  Time Range: after October 1 2020
  - Delete from history and materialized collections all permutations of "Adolescence" for treatment plans for every book
  - Actual stuff to delete: All ptps associated with { indication: 'Atopic Dermatitis', population: 'Adolescent', regimen: 'Dupixent', coverage: 'Pharmacy', books: ALL_BOOKS }
*/

/*

{
  indication: 'Atopic Dermatitis',
  population: 'Adult',
  regimen: 'Dupixent',
  coverage: 'Pharmacy',
  book: ANY_BOOK,
  slug: ANY
}

*/

const rewriteHistory = async () => {
  const dbs = await connectToMongoDb()
  const pulseCoreDb = dbs.db('pulse-core')
  const pulseDevDb = dbs.db('pulse-dev')
debugger
  try {
    await stepOne(pulseCoreDb, pulseDevDb)
    await stepTwo(pulseCoreDb, pulseDevDb)
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
debugger
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
