const combineTeamsResources = require('./combineTeamsResources')

/*
  generateUserPerms combines all userTeams' resources
  then uses master lists to match resources to actionable
  fields for filtering such as `slug` or `name`.

  Expected return value is `{ _id: user._id, resources }`,
  which will be persisted directly to `users.nodes.resources`
  in `pulse-dev`. The 'username' field is purposely excluded
  to avoid needing to update the username if it's
  changed in Phoenix.
*/

module.exports = async ({
  userId,
  pulseDevDb,
  pulseCoreDb,
  masterListItemsById,
  session,
}) => {
  const userTeams = await pulseCoreDb
    .collection('roles')
    .find(
      { 'users._id': userId },
      { session },
    )
    .toArray()

  const resources = combineTeamsResources({
    teams: userTeams,
    masterListItemsById,
  })

  await pulseDevDb.collection('users.nodes.resources')
    .updateOne(
      { _id: userId },
      {
        $set: {
          _id: userId,
          resources,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { session, upsert: true }
    )

  return ({
    _id: userId,
    resources,
  })
}
