module.exports = [
  {
    '$group': {
      '_id': {
        'orgTpId': '$orgTpId',
        'month': '$dateParts.month',
        'year': '$dateParts.year'
      },
      'data': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$addFields': {
      'data': {
        '$slice': [
          '$data', 1
        ]
      }
    }
  }, {
    '$unwind': '$data'
  }, {
    '$replaceRoot': {
      'newRoot': '$data'
    }
  }, {
    '$sort': {
      'timestamp': -1
    }
  }
]
