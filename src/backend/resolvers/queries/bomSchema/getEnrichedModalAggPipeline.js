const { ObjectId } = require('mongodb')

module.exports = boId => [
  {
    '$match': {
      'boId': ObjectId(boId)
    }
  }, {
    '$lookup': {
      'from': 'businessObjects',
      'localField': 'boId',
      'foreignField': '_id',
      'as': 'bo'
    }
  }, {
    '$addFields': {
      'bo': {
        '$arrayElemAt': [
          '$bo', 0
        ]
      }
    }
  }, {
    '$addFields': {
      'boFieldsRef': '$bo.fields',
      'sourceCollection': '$bo.sourceCollection'
    }
  }, {
    '$project': {
      '_id': 1,
      'label': 1,
      'tags': 1,
      'boFieldsRef': 1,
      'sourceCollection': 1,
    }
  }
]
