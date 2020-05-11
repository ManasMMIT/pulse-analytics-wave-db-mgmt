const latestTimestampAggStages = require('./latest-timestamp-agg-stages')

module.exports = source => [
  {
    '$match': {
      'source': source,
      'territoryType': 'National'
    }
  },
  ...latestTimestampAggStages,
  {
    '$group': {
      '_id': {
        'book': '$book',
        'coverage': '$coverage'
      },
      'lives': {
        '$sum': '$lives'
      }
    }
  }, {
    '$project': {
      '_id': 0,
      'book': '$_id.book',
      'coverage': '$_id.coverage',
      'lives': 1
    }
  }
]
