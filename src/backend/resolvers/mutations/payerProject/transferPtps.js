const { ObjectId } = require('mongodb')
const _ = require('lodash')

// TODO Plan of Attack
// 1. Find all orgTpId owners
//    - It's possible for incoming PTPs to be owned by different projects
// 2. Move orgTps from owners' orgTpIds array to extraOrgTps array
// 3. Pull orgTps from incoming project's extraOrgTpIds
//    - The target project may already have those PTPs in its extra slice
//    - This step makes sure it doesn't have the same PTPs in its extra slice and its ownership list
// 4. Add orgTps into incoming project's orgTpIds array

const transferPtps = async (
  parent,
  {
    input: {
      projectId,
      orgTpIds,
    }
  },
  { pulseCoreDb, mongoClient },
  info
) => {
  projectId = ObjectId(projectId)
  const pTpsToTransfer = orgTpIds.map(ObjectId)
  const session = mongoClient.startSession()

  let result = {}

  await session.withTransaction(async () => {
    const tdgProjectsCollection = pulseCoreDb.collection('tdgProjects')

    const orgTpIdsFindObj = {
      orgTpIds: {
        $in: pTpsToTransfer,
      }
    }

    // 1. Find all orgTpId owners
    const oldPtpOwners = await tdgProjectsCollection.find(
      orgTpIdsFindObj,
      { session }
    ).toArray()

    // 2. Disown relevant orgTpIds from original owners by moving to their extraOrgTpIds
    const disownOps = oldPtpOwners.map(async ({ _id, orgTpIds: ownedPtps }) => {
      _id = ObjectId(_id)

      const currentProjectOwnedPtps = _.intersectionBy(
        ownedPtps,
        pTpsToTransfer,
        d => d.toString(),
      )

      await tdgProjectsCollection.updateOne(
        { _id },
        {
          $pull: {
            orgTpIds: { $in: currentProjectOwnedPtps }
          },
        },
        { session }
      )

      await tdgProjectsCollection.updateOne(
        { _id },
        {
          $addToSet: {
            extraOrgTpIds: { $each: currentProjectOwnedPtps },
          }
        },
        { session }
      )
    })

    await Promise.all(disownOps)

    // 3. Strip soon-to-be-owned PTPs from target project
    await tdgProjectsCollection.updateOne(
      { _id: projectId },
      {
        $pull: {
          extraOrgTpIds: { $in: pTpsToTransfer }
        },
      },
      { session }
    )

    // 4. Assign PTP ownership to target project
    const { value: updatedProject } = await tdgProjectsCollection.findOneAndUpdate(
      { _id: projectId },
      {
        $addToSet: { // orgTpIds should be unique list due to db indexing so $push would also work here
          orgTpIds: { $each: pTpsToTransfer }
        },
      },
      { session, returnOriginal: false }
    )

    result = updatedProject
  })

  return result
}

module.exports = transferPtps
