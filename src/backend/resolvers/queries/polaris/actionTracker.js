const actionTracker = (
  parent,
  {
    action,
    limit = 1,
  },
  { pulseCoreDb },
) => (
  pulseCoreDb.collection('polaris.users.actions')
    .find({ action })
    .limit(limit)
    .toArray()
)

module.exports = actionTracker
