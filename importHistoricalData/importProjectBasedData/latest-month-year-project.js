const getLatestMonthYearProjectPipeline = limit => ([
  {
    $group: {
      _id: {
        project: '$project',
        year: '$year',
        month: '$month'
      },
      data: { $push: '$$ROOT' }
    }
  },
  {
    $sort: {
      '_id.year': -1,
      '_id.month': -1
    }
  },
  {
    $group: {
      _id: {
        project: '$_id.project'
      },
      data: { $push: '$data'}
    }
  },
  {
    $project: {
      latestData: { $slice: ['$data', limit] }
    }
  },
  {
    $unwind: '$latestData'
  },
  {
    $unwind: '$latestData'
  },
  {
    $replaceRoot: {
      newRoot: '$latestData'
    }
  }
])

module.exports = getLatestMonthYearProjectPipeline
