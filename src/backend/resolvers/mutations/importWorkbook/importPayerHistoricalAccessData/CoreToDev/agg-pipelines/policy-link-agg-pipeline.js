module.exports = limit => [
  {
    '$match': {
      'policyLinkData': {
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
      'slug': '$organization.slug',
      'organization': '$organization.organization'
    }
  }, {
    '$sort': {
      'timestamp': -1
    }
  }, {
    '$group': {
      '_id': {
        'book': '$book',
        'coverage': '$coverage',
        'regimen': '$regimen',
        'slug': '$slug',
        'month': '$dateParts.month',
        'year': '$dateParts.year'
      },
      'latestDocsWithinMonthYear': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$addFields': {
      'latestDocsWithinMonthYear': {
        '$slice': [
          '$latestDocsWithinMonthYear', 1
        ]
      }
    }
  }, {
    '$unwind': '$latestDocsWithinMonthYear'
  }, {
    '$replaceRoot': {
      'newRoot': '$latestDocsWithinMonthYear'
    }
  }, {
    '$sort': {
      'timestamp': -1
    }
  }, {
    '$project': {
      '_id': 0,
      'timestamp': 1,
      'month': '$dateParts.month',
      'year': '$dateParts.year',
      'book': 1,
      'coverage': 1,
      'regimen': 1,
      'slug': 1,
      'organization': 1,
      'link': '$policyLinkData.policyLink',
      'dateTracked': '$policyLinkData.dateTracked',
      'paLink': '$policyLinkData.paLink',
      'siteLink': '$policyLinkData.siteLink',
      'project': null
    }
  },
  {
    '$group': {
      '_id': {
        'book': '$book',
        'coverage': '$coverage',
        'regimen': '$regimen',
        'slug': '$slug'
      },
      'historicalDocs': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$addFields': {
      'historicalDocs': {
        '$slice': [
          '$historicalDocs', limit
        ]
      }
    }
  }, {
    '$unwind': '$historicalDocs'
  }, {
    '$replaceRoot': {
      'newRoot': '$historicalDocs'
    }
  }
]
