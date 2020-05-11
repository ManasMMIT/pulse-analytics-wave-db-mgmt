module.exports = _ids => [
  {
    '$match': {
      'treatmentPlanId': { $in: _ids },
    }
  },
  {
    '$lookup': {
      'from': 'organizations',
      'localField': 'organizationId',
      'foreignField': '_id',
      'as': 'orgData'
    }
  }, {
    '$lookup': {
      'from': 'treatmentPlans',
      'localField': 'treatmentPlanId',
      'foreignField': '_id',
      'as': 'tpData'
    }
  }, {
    '$addFields': {
      'org': {
        '$arrayElemAt': [
          '$orgData', 0
        ]
      },
      'tp': {
        '$arrayElemAt': [
          '$tpData', 0
        ]
      }
    }
  }, {
    '$project': {
      'organizationId': 1,
      'treatmentPlanId': 1,
      'slug': '$org.slug',
      'indication': '$tp.indication',
      'regimen': '$tp.regimen',
      'population': '$tp.population',
      'line': '$tp.line',
      'book': '$tp.book',
      'coverage': '$tp.coverage',
      'additionalCriteriaData': 1,
      'policyLinkData': 1,
      'project': 1,
      'timestamp': 1,
      'tierData': 1,
      'accessData': 1
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
      'from': 'populations',
      'localField': 'population',
      'foreignField': '_id',
      'as': 'population'
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
      }
    }
  }, {
    '$addFields': {
      'indication': '$indication.name',
      'regimen': '$regimen.name',
      'population': '$population.name',
      'line': '$line.name',
      'book': '$book.name',
      'coverage': '$coverage.name'
    }
  }
]
