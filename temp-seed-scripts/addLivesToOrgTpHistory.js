const _ = require('lodash')

module.exports = async pulseCore => {  
  // 1. hash livesDocs by [book, coverage, timestamp].join('|')
  const livesDocs = await pulseCore.collection('lives').find().toArray()

  const livesSplitByType = _.groupBy(
    livesDocs,
    'territoryType',
  )
  // const livesSplitByType = formatLivesByNatState(livesDocs)

  const nationalLivesDocsHash = _.groupBy(
    livesSplitByType.National,
    ({ book, coverage, timestamp, organizationId }) => [book, coverage, timestamp, organizationId].join('|')
  )

  const stateLivesDocsHash = _.groupBy(
    livesSplitByType['U.S. State'],
    ({ book, coverage, timestamp, organizationId }) => [book, coverage, timestamp, organizationId].join('|')
  )

  // 3. get enriched orgTpHistoryDocs with book and coverage
  const orgTpHistoryDocs = await pulseCore.collection('organizations.treatmentPlans.history')
    .aggregate(ENRICH_ORG_TP_HIST_WITH_BOOK_COVERAGE_PIPELINE)
    .toArray()

  // 4. hash orgTpHistoryDocs by [book, coverage, timestamp].join('|')
  const orgTpHistoryDocsHash = _.groupBy(
    orgTpHistoryDocs,
    ({ book, coverage, timestamp, organizationId }) => [book, coverage, timestamp, organizationId].join('|')
  )

  // 5. format all arrays in orgTpHistoryDocs to just by _ids

  Object.keys(orgTpHistoryDocsHash).forEach(hash => {
    orgTpHistoryDocsHash[hash] = orgTpHistoryDocsHash[hash].map(({ _id }) => _id)
  })

  // 6. iterate over livesDocsHash, find orgTpHistoryDocs that match and output [{ lives, docIds }, ...]
  const opObjs = Object.keys(orgTpHistoryDocsHash).map(hash => {
    return ({
      lives: {
        national: nationalLivesDocsHash[hash] || [],
        state: stateLivesDocsHash[hash] || [],
      },
      docIds: orgTpHistoryDocsHash[hash] || [],
    })
  })

  // 7. Go over opObjs and build ops then wait for them to finish
  // const ops = opObjs.map(({ lives, docIds }) => (
  //   pulseCore
  //     .collection('organizations.treatmentPlans.history')
  //     .updateMany(
  //       { _id: {
  //         $in: docIds,
  //         }
  //       },
  //       {
  //         $set: {
  //           lives,
  //         }
  //       }
  //     )
  // ))

  // await Promise.all(ops)
  
  // const wurt = await pulseCore.collection('organizations.treatmentPlans.history').aggregate(CRAZY_LIVES_LOOKUP_PIPELINE).toArray()
  debugger
}

const ENRICH_ORG_TP_HIST_WITH_BOOK_COVERAGE_PIPELINE = [
  {
    '$lookup': {
      'from': 'treatmentPlans',
      'localField': 'treatmentPlanId',
      'foreignField': '_id',
      'as': 'treatmentPlan'
    }
  }, {
    '$addFields': {
      'treatmentPlan': {
        '$arrayElemAt': [
          '$treatmentPlan', 0
        ]
      }
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
      'book': {
        '$arrayElemAt': [
          '$book.name', 0
        ]
      },
      'coverage': {
        '$arrayElemAt': [
          '$coverage.name', 0
        ]
      }
    }
  }
]

// breaks node memory: 
// const CRAZY_LIVES_LOOKUP_PIPELINE = [
//   {
//     '$lookup': {
//       'from': 'treatmentPlans',
//       'localField': 'treatmentPlanId',
//       'foreignField': '_id',
//       'as': 'treatmentPlan'
//     }
//   }, {
//     '$lookup': {
//       'from': 'books',
//       'localField': 'treatmentPlan.book',
//       'foreignField': '_id',
//       'as': 'book'
//     }
//   }, {
//     '$lookup': {
//       'from': 'coverages',
//       'localField': 'treatmentPlan.coverage',
//       'foreignField': '_id',
//       'as': 'coverage'
//     }
//   }, {
//     '$addFields': {
//       'book': {
//         '$arrayElemAt': [
//           '$book', 0
//         ]
//       },
//       'coverage': {
//         '$arrayElemAt': [
//           '$coverage', 0
//         ]
//       }
//     }
//   }, {
//     '$project': {
//       '_id': 1,
//       'orgTpId': 1,
//       'organizationId': 1,
//       'treatmentPlanId': 1,
//       'accessData': 1,
//       'tierData': 1,
//       'timestamp': 1,
//       'project': 1,
//       'policyLinkData': 1,
//       'additionalCriteriaData': 1,
//       'book': '$book.name',
//       'coverage': '$coverage.name'
//     }
//   }, {
//     '$lookup': {
//       'from': 'lives',
//       'let': {
//         'book': '$book',
//         'coverage': '$coverage',
//         'timestamp': '$timestamp',
//         'organizationId': '$organizationId'
//       },
//       'pipeline': [
//         {
//           '$match': {
//             '$expr': {
//               '$and': [
//                 {
//                   '$eq': [
//                     '$book', '$$book'
//                   ]
//                 }, {
//                   '$eq': [
//                     '$coverage', '$$coverage'
//                   ]
//                 }, {
//                   '$where': '$timestamp > $$timestamp'
//                 }, {
//                   '$eq': [
//                     '$organizationId', '$$organizationId'
//                   ]
//                 }
//               ]
//             }
//           }
//         }
//       ],
//       'as': 'lives'
//     }
//   }, {
//     '$project': {
//       '_id': 1,
//       'orgTpId': 1,
//       'organizationId': 1,
//       'treatmentPlanId': 1,
//       'accessData': 1,
//       'tierData': 1,
//       'timestamp': 1,
//       'project': 1,
//       'policyLinkData': 1,
//       'additionalCriteriaData': 1,
//       'lives': 1
//     }
//   }
// ]