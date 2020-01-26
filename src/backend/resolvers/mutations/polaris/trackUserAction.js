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
    .find({ action })
    .limit(limit + 1)
    .sort({ createdAt: 1 })
    .toArray()

  return {
    latest: userActionDoc,
    history,
  }
}

module.exports = trackUserAction
