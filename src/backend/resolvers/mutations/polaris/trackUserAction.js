const trackUserAction = async (
  parent,
  { input: { user, action, limit = 1 } },
  { pulseCoreDb },
  info,
) => {
  debugger
  // Step 1: Upsert into polaris.users, so we have up-to-date user info to reference 
  const upsertPolarisUserOp = pulseCoreDb.collection('polaris.users')
    .updateOne(
      { _id: user.userId },
      user,
      { upsert: true }
    )

  // Step 2: Insert polaris.users.action doc
  const userActionDoc = {
    userId: user.userId,
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
  const actionDocs = await pulseCoreDb.collection('polaris.users.actions')
    .find({ action })
    .limit(limit + 1)
    .toArray()

  // Step 4: Form then return data object
  const actionHistory = actionDocs.slice(1)

  return {
    latest: userActionDoc,
    history: actionHistory,
  }
}

module.exports = trackUserAction
