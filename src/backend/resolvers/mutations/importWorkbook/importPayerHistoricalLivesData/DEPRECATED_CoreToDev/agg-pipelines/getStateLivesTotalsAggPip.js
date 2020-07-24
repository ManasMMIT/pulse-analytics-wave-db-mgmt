const latestTimestampAggStages = require('./latest-timestamp-agg-stages')

module.exports = (source) => [
  {
    $match: {
      source,
      territoryType: 'U.S. State',
    },
  },
  ...latestTimestampAggStages,
  {
    $group: {
      _id: {
        book: '$book',
        coverage: '$coverage',
        state: '$territoryName',
      },
      lives: {
        $sum: '$lives',
      },
    },
  },
  {
    $project: {
      _id: 0,
      book: '$_id.book',
      coverage: '$_id.coverage',
      state: '$_id.state',
      lives: 1,
    },
  },
  {
    $group: {
      _id: '$state',
      bookCoverageSums: {
        $push: '$$ROOT',
      },
    },
  },
]
