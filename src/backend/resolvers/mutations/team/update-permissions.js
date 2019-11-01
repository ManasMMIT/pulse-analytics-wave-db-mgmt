const objectifyResourcesIds = require('./utils/objectifyResourcesIds')

const updatePermissions = async (
  parent,
  { input: { teamId, nodeId, updatedResources } },
  { mongoClient, coreRoles },
  info
) => {
  objectifyResourcesIds(updatedResources)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    // check 1: if team doesn't have a resources array, create it
    // along with an object corresponding to nodeId
    const team = await coreRoles.findOne({ _id: teamId }, { session })

    if (!team.resources) {
      await coreRoles.updateOne(
        { _id: teamId },
        { $set: { resources: [{ nodeId }] } },
        { session },
      )
    } else if (
      // check 2: if team has a resources array, is there an obj corresponding
      // to nodeId? obj needs to be there for the operation that follows
      !team.resources.find(({ nodeId: resId }) => resId === nodeId)
    ) {
      await coreRoles.updateOne(
        { _id: teamId },
        { $push: { resources: { nodeId } } },
        { session },
      )
    }

    const {
      value: updatedTeam
    } = await coreRoles.findOneAndUpdate(
      { _id: teamId, resources: { $elemMatch: { nodeId } } },
      {
        // replace a single object in the team's resources array
        $set: {
          'resources.$': { nodeId, ...updatedResources }
        }
      },
      { returnOriginal: false, session }
    )

    result = updatedTeam
  })

  return result
}

module.exports = updatePermissions
