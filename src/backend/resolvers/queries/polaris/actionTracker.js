const getAggPipeline = (action, limit) => [
  {
    $match: { action }
  },
  {
    $sort: { createdAt: -1 }
  },
  {
    $limit: limit
  },
  {
    $lookup: {
      from: 'polaris.users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $project: {
      action: 1,
      createdAt: 1,
      user: { $arrayElemAt: ['$user', 0] }
    }
  },
]

const actionTracker = (
  parent,
  {
    action,
    limit = 0,
  },
  { pulseCoreDb },
) => pulseCoreDb.collection('polaris.users.actions')
  .aggregate(getAggPipeline(action, limit))
  .toArray()

module.exports = actionTracker
