/* eslint-disable no-loop-func */
const upsertUsersPermissions = require('../permissions-upsertion/upsertUsersPermissions')

const overrideUpsertPermissions = async ({
  pulseCoreDb,
  pulseDevDb,
}) => {
  const coreUsers = pulseCoreDb.collection('users')

  await pulseDevDb.collection('users.nodes.resources')
    .deleteMany({})

  console.log('users.nodes.resources successfully dropped')

  const users = await coreUsers.find().toArray()

  await upsertUsersPermissions({
    users,
    pulseCoreDb,
    pulseDevDb,
  })

  console.log('users.nodes.resources successfully rebuilt')
}

module.exports = overrideUpsertPermissions
