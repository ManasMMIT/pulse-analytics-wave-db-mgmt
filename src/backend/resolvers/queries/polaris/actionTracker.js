const actionTracker = (
  parent,
  {
    action,
    limit = 0,
  },
  { pulseCoreDb },
) => pulseCoreDb.collection('polaris.users.actions')
  .find({ action })
  .limit(limit)
  .sort({ createdAt: 1 })
  .toArray()

module.exports = actionTracker
