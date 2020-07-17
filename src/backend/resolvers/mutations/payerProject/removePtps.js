const { ObjectId } = require('mongodb')

const removePtps = async (
  parent,
  { input: { projectId, orgTpIds: orgTpIdsToRemove } },
  { pulseCoreDb },
  info
) => {
  orgTpIdsToRemove = orgTpIdsToRemove.map(ObjectId)

  await pulseCoreDb.collection('tdgProjects').updateOne(
    {
      _id: ObjectId(projectId),
    },
    {
      $pull: {
        orgTpIds: {
          $in: orgTpIdsToRemove,
        },
        extraOrgTpIds: {
          $in: orgTpIdsToRemove,
        },
      },
    }
  )

  return orgTpIdsToRemove
}

module.exports = removePtps
