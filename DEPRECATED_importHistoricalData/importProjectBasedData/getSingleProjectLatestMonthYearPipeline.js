const getSingleProjectLatestMonthYearPipeline = (project, limit) => [
  {
    $match: { project }
  }, {
    $group: {
      _id: {
        year: '$year',
        month: '$month'
      },
      data: {
        $push: '$$ROOT'
      }
    }
  }, {
    $sort: {
      '_id.year': -1,
      '_id.month': -1
    }
  },
  {
    $limit: limit
  },
  {
    $unwind: '$data'
  },
  {
    $replaceRoot: {
      newRoot: '$data'
    }
  }
]

module.exports = getSingleProjectLatestMonthYearPipeline
