const objectifyResourcesIds = require('./utils/objectifyResourcesIds')
const cascadeUpdateResources = require('./utils/cascadeUpdateResources')

const updatePermissions = async (
  parent,
  { input: { teamId, nodeId, updatedResources } },
  { mongoClient, coreRoles, coreNodes },
  info
) => {
  objectifyResourcesIds(updatedResources)

  const nextResources = { nodeId, ...updatedResources }

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const team = await coreRoles.findOne({ _id: teamId }, { session })

    // if team doesn't have a resources array, initialize it
    // as an empty array
    const resourcesAcrossNodes = team.resources || []

    // get all the nodes because you have to recursively find all
    // of the node's children
    const nodes = await coreNodes.find().toArray()

    // get the subset of node resource objects, update them, and
    // return the updated subset, including the nextResources
    const changedNodeResourcesObjs = cascadeUpdateResources({
      nodes,
      nextResources,
      resourcesAcrossNodes,
    })

   // upsert changedNodeResourcesObjs into resourcesAcrossNodes
   changedNodeResourcesObjs.forEach(nodeResourcesObj => {
      const targetIdx = resourcesAcrossNodes.findIndex(
        ({ nodeId: nId }) => nId === nodeResourcesObj.nodeId
      )

      if (targetIdx === -1) {
        resourcesAcrossNodes.push(nodeResourcesObj)
      } else {
        resourcesAcrossNodes[targetIdx] = nodeResourcesObj
      }
    })

    const {
      value: updatedTeam
    } = await coreRoles.findOneAndUpdate(
      { _id: teamId },
      { $set: { resources: resourcesAcrossNodes } },
      { session, returnOriginal: false },
    )

    result = updatedTeam
  })

  return result
}

module.exports = updatePermissions
