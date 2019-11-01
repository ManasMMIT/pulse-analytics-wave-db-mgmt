/* eslint-disable no-loop-func */
const _ = require('lodash')
const generateUserPerms = require('./generateUserPerms')

const generateUsersPermissions = async({
  mongoClient,
  pulseCoreDb,
  pulseDevDb,
}) => {
  const coreRoles = pulseCoreDb.collection('roles')
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

    const usersNodesResourcesPromises = users.map(async user => {
      const userTeams = await coreRoles.find(
        { 'users._id': user._id },
        { session }
      ).toArray()

      const userTeamsWithResources = userTeams
        .filter(({ resources }) => resources)

      const teamsResources = _.flatten(userTeamsWithResources.map(({ resources }) => resources))

      const teamResourcesByNodeId = _.groupBy(teamsResources, 'nodeId')

      const userPerms = generateUserPerms({
        userId: user._id,
        teamResourcesByNodeId,
        masterListItemsById,
      })

      return userPerms
    })

    const docs = await Promise.all(usersNodesResourcesPromises)

    await pulseDevDb
      .collection('users.nodes.resources')
      .insertMany(docs, { session })

    console.log('users.nodes.resources successfully rebuilt')
  })
}

module.exports = generateUsersPermissions
