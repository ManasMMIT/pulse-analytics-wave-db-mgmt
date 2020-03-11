const _ = require('lodash')
const upsertUserPerms = require('./upsertUserPerms')

const upsertUsersPermissions = async ({
  users,
  pulseCoreDb,
  pulseDevDb,
  session,
}) => {
  console.log(`\nStarting to rebuild resources for ${ users.length } user(s)`)

  const masterLists = await Promise.all(
    ['organizations', 'indications', 'regimens'].map(collectionName => {
      return pulseCoreDb.collection(collectionName).find().toArray()
    })
  )

  const masterListItemsById = _.keyBy(
    _.flatten(masterLists),
    '_id',
  )

  const userOps = users.map(user => (
    upsertUserPerms({
      userId: user._id,
      pulseDevDb,
      pulseCoreDb,
      masterListItemsById,
      session,
    })
  ))

  await Promise.all(userOps)

  console.log('Finished rebuilding user(s) resources\n')
}

module.exports = upsertUsersPermissions