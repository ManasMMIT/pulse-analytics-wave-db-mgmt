const getLatestWithinEachMonthYearPtp = require('./get-latest-within-each-month-year-ptp')

module.exports = limit => [
  {
    '$match': {
      'accessData': {
        '$exists': true,
        '$nin': [null, {}],
      }
    }
  }, {
    '$addFields': {
      'dateParts': {
        '$dateToParts': {
          'date': '$timestamp'
        }
      }
    }
  }, {
    '$sort': {
      'timestamp': -1
    }
  },
  ...getLatestWithinEachMonthYearPtp,
  {
    '$group': {
      '_id': {
        'orgTpId': '$orgTpId'
      },
      'data': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$addFields': {
      'data': {
        '$slice': [
          '$data', limit
        ]
      }
    }
  }, {
    '$lookup': {
      'from': 'organizations',
      'localField': 'data.organizationId',
      'foreignField': '_id',
      'as': 'organization'
    }
  }, {
    '$lookup': {
      'from': 'treatmentPlans',
      'localField': 'data.treatmentPlanId',
      'foreignField': '_id',
      'as': 'treatmentPlan'
    }
  }, {
    '$lookup': {
      'from': 'indications',
      'localField': 'treatmentPlan.indication',
      'foreignField': '_id',
      'as': 'indication'
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
      'from': 'lines',
      'localField': 'treatmentPlan.line',
      'foreignField': '_id',
      'as': 'line'
    }
  }, {
    '$lookup': {
      'from': 'populations',
      'localField': 'treatmentPlan.population',
      'foreignField': '_id',
      'as': 'population'
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
      },
      'organization': {
        '$arrayElemAt': [
          '$organization', 0
        ]
      }
    }
  }, {
    '$addFields': {
      'data.indication': '$indication.name',
      'data.regimen': '$regimen.name',
      'data.population': '$population.name',
      'data.line': '$line.name',
      'data.book': '$book.name',
      'data.coverage': '$coverage.name',
      'data.slug': '$organization.slug',
      'data.organization': '$organization.organization'
    }
  }, {
    '$project': {
      'historicalDocs': '$data'
    }
  }, {
    '$unwind': {
      'path': '$historicalDocs'
    }
  }, {
    '$replaceRoot': {
      'newRoot': '$historicalDocs'
    }
  }
]
