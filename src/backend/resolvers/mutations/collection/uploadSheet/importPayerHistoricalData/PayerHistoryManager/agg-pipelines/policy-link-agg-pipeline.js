module.exports = limit => [
  {
    '$addFields': {
      'dateParts': {
        '$dateToParts': {
          'date': '$timestamp'
        }
      }
    }
  }, {
    '$match': {
      'policyLinkData': {
        '$ne': null
      }
    }
  }, {
    '$sort': {
      'timestamp': -1
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
    '$group': {
      '_id': {
        'timestamp': '$timestamp',
        'month': '$dateParts.month',
        'year': '$dateParts.year',
        'book': '$book',
        'coverage': '$coverage',
        'regimen': '$regimen',
        'slug': '$slug',
        'organization': '$organization'
      },
      'data': {
        '$addToSet': '$policyLinkData'
      }
    }
  }, {
    '$project': {
      'data': {
        '$arrayElemAt': [
          '$data', 0
        ]
      }
    }
  }, {
    '$project': {
      '_id': 0,
      'timestamp': '$_id.timestamp',
      'month': '$_id.month',
      'year': '$_id.year',
      'book': '$_id.book',
      'coverage': '$_id.coverage',
      'regimen': '$_id.regimen',
      'slug': '$_id.slug',
      'organization': '$_id.organization',
      'link': '$data.policyLink',
      'dateTracked': '$data.dateTracked',
      'paLink': '$data.paLink',
      'project': '$data.project',
      'siteLink': '$data.siteLink'
    }
  }, {
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
