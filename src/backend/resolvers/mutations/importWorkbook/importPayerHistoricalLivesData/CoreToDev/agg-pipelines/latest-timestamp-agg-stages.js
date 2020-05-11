module.exports = [
  {
    '$group': {
      '_id': '$timestamp',
      'docs': {
        '$push': '$$ROOT'
      }
    }
  }, {
    '$sort': {
      '_id': -1
    }
  }, {
    '$limit': 1
  }, {
    '$unwind': {
      'path': '$docs'
    }
  }, {
    '$replaceRoot': {
      'newRoot': '$docs'
    }
  },
]
