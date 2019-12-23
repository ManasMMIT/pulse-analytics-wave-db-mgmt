/* eslint-disable no-loop-func */
const _ = require('lodash')
const upsertUserPerms = require('./upsertUserPerms')

const generateUsersPermissions = async({
  mongoClient,
  pulseCoreDb,
  pulseDevDb,
}) => {
  const coreUsers = pulseCoreDb.collection('users')

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    await pulseDevDb.collection('users.nodes.resources')
      .deleteMany({}, { session })

    console.log('users.nodes.resources successfully dropped')

    const users = await coreUsers.find().toArray()
    const masterLists = await Promise.all(
      ['organizations', 'indications', 'regimens'].map(collectionName => {
        return pulseCoreDb.collection(collectionName).find().toArray()
      })
    )

    const masterListItemsById = _.keyBy(
      _.flatten(masterLists),
      '_id',
    )

    const usersNodesResourcesPromises = users.map(user => (
      upsertUserPerms({
        userId: user._id,
        pulseDevDb,
        pulseCoreDb,
        masterListItemsById,
        session,
      })
    ))

    const docs = await Promise.all(usersNodesResourcesPromises)

    await pulseDevDb
      .collection('users.nodes.resources')
      .insertMany(docs, { session })

    console.log('users.nodes.resources successfully rebuilt')
  })
}

module.exports = generateUsersPermissions
