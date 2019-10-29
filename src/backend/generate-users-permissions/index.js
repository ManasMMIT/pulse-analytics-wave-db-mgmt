/* eslint-disable no-loop-func */
const { ObjectId } = require('mongodb')
const _ = require('lodash')

const generateSitemaps = async ({
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
    const usersNodesResourcesPromises = users.map(async user => {
      const userTeams = await coreRoles.find(
        { 'users._id': user._id },
        { session }
      ).toArray()

      const userTeamsWithResources = userTeams.filter(({ resources }) => resources)

      const allTeamsResources = _.flatten(userTeamsWithResources.map(({ resources }) => resources))

      const allTeamsResourcesGroupedByNodeId = _.groupBy(allTeamsResources, 'nodeId')

      const resources = []
      for (let nodeId in allTeamsResourcesGroupedByNodeId) {
        const allNodeResources = allTeamsResourcesGroupedByNodeId[nodeId]

        let nodeResources = {
          nodeId: allNodeResources[0].nodeId,
          accounts: [],
          regionalBreakdown: [],
          treatmentPlans: [],
        }

        for (let j = 0; j < allNodeResources.length; j++) {
          const singleNodeResource = allNodeResources[j]
          
          const { accounts = [], regionalBreakdown = [], treatmentPlans = [] } = singleNodeResource

          let accountIds = accounts.map(({ _id }) => ObjectId(_id))
          // ! COMBINE ACCOUNTS
          let masterListAccountObjects = await pulseCoreDb.collection('organizations')
            .find({
              _id: {
                $in: accountIds
              }
            }).toArray()

          masterListAccountObjects = masterListAccountObjects.map(({ _id, slug }) => ({ _id, slug }))

          const combinedAccountIds = nodeResources.accounts.concat(masterListAccountObjects)
          nodeResources.accounts = _.uniqBy(combinedAccountIds, '_id')

          // ! "COMBINE" REG BRKDWN
          nodeResources.regionalBreakdown = regionalBreakdown

          // ! COMBINE TREATMENT PLANS

          for (let k = 0; k < treatmentPlans.length; k++) {
            const treatmentPlan = treatmentPlans[k];

            const { _id: newId, regimens: newRegimens } = treatmentPlan

            const { name } = await pulseCoreDb.collection('indications').findOne({ _id: ObjectId(newId) })

            const regimenIds = newRegimens.map(({ _id }) => ObjectId(_id))
            let masterListRegimens = await pulseCoreDb.collection('regimens')
              .find({
                _id: {
                  $in: regimenIds
                }
              }).toArray()

            masterListRegimens = masterListRegimens.map(({ _id, name }) => ({ _id: ObjectId(_id), name }))

            const existingIndication = nodeResources.treatmentPlans
              .find(({ _id: existingId }) => existingId.equals(ObjectId(newId)))

            if (existingIndication) {
              const combinedRegimens = existingIndication.regimens.concat(masterListRegimens)
              existingIndication.regimens = _.uniqBy(combinedRegimens, '_id')
            } else {
              nodeResources.treatmentPlans.push({ _id: ObjectId(newId), name, regimens: masterListRegimens})
            }
          }

        }

        resources.push(nodeResources)
      }

      return { _id: user._id, resources }
    })

    const docs = await Promise.all(usersNodesResourcesPromises)

    await pulseDevDb.collection('users.nodes.resources')
      .insertMany(
        docs,
        { session },
      )

    console.log('User Resources have been persisted to dev')
  })

  return true
}

module.exports = generateSitemaps
