const latestMonthYearAggPipeline = [
  {
    $group: {
      _id: {
        year: '$year',
        month: '$month',
      },
      data: { $push: '$$ROOT' },
    },
  },
  {
    $sort: {
      '_id.year': -1,
      '_id.month': -1,
    },
  },
  {
    $limit: 1,
  },
  {
    $unwind: '$data',
  },
  {
    $replaceRoot: { newRoot: '$data' },
  },
]

module.exports = latestMonthYearAggPipeline
