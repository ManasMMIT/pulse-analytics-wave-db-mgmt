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

const trackUserAction = async (
  parent,
  { input: { user, action, limit = 1 } },
  { pulseCoreDb },
  info,
) => {
  // Step 1: Upsert into polaris.users, so we have up-to-date user info to reference 
  const upsertPolarisUserOp = pulseCoreDb.collection('polaris.users')
    .updateOne(
      { _id: user.sub },
      {
        $set: {...user}
      },
      { upsert: true }
    )

  // Step 2: Insert polaris.users.action doc
  const userActionDoc = {
    userId: user.sub,
    action,
    createdAt: new Date(),
  }

  const insertUserActionOp = pulseCoreDb
    .collection('polaris.users.actions')
    .insertOne(userActionDoc)

  await Promise.all([
    upsertPolarisUserOp,
    insertUserActionOp,
  ])

  // Step 3: Retrieve docs for action, up to limit
  const history = await pulseCoreDb.collection('polaris.users.actions')
    .aggregate(getAggPipeline(action, limit))
    .toArray()

  return {
    history
  }
}

module.exports = trackUserAction
