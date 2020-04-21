const { ObjectId } = require('mongodb')
const _ = require('lodash')

// TODO: Plan of Attack
// 1. cross-product orgIds and treatmentPlanIds to get full set of PTP combos
// 2. upsert PTPS into `organizations.treatmentPlans`
// 3. find all orgTpIds for PTPS

// 4. find all orgTpIds that are owned by others

// 5. set (replace) `extraOrgTpIds` to IDs owned by others and orgTpIds to the leftover incoming PTP combos

const updatePtps = async (
  parent,
  {
    input: {
      projectId,
      organizationIds,
      treatmentPlanIds,
    }
  },
  { pulseCoreDb, mongoClient },
  info
) => {
  organizationIds = organizationIds.map(ObjectId)
  treatmentPlanIds = treatmentPlanIds.map(ObjectId)
  projectId = ObjectId(projectId)

  let result = {}
  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // 1. cross-product orgIds and treatmentPlanIds to get full set of PTP combos
    const totalSetOfOrgTpCombos = organizationIds
      .reduce((acc, organizationId) => {
        const orgTps = treatmentPlanIds
          .map(treatmentPlanId => ({
            treatmentPlanId,
            organizationId
          }))

        return acc.concat(orgTps)
      }, [])

    // 2. upsert PTPS into `organizations.treatmentPlans`
    // 3. find all orgTpIds for PTPS
    const incomingPtps = []

    const upsertOps = totalSetOfOrgTpCombos
      .map(async ({ treatmentPlanId, organizationId }) => {
        const { value: updatedOrgTp } = await pulseCoreDb
          .collection('organizations.treatmentPlans')
          .findOneAndUpdate(
            { treatmentPlanId, organizationId },
            {
              $set: {
                treatmentPlanId,
                organizationId,
              }
            },
            {
              returnOriginal: false,
              upsert: true,
              session,
            }
          )

        incomingPtps.push(updatedOrgTp._id)
      })

    await Promise.all(upsertOps)

    // 4. find all PTPs that are owned by others
    const aggPipeline = getPtpsOwnedByOtherProjects(projectId, incomingPtps)

    const pTpsOwnedByOtherProjects = await pulseCoreDb
      .collection('testTdgProjects')
      .aggregate(
        aggPipeline,
        { allowDiskUse: true, session })
      .toArray()

    const pTpIdsOwnedByOtherProjects = pTpsOwnedByOtherProjects.map(({ _id }) => _id)

    // 5. find PTPs that are not-owned / already owned by this project
    const freeToOwnPtps = _.differenceBy(
      incomingPtps,
      pTpIdsOwnedByOtherProjects,
      v => v.toString()
    )

    // 6. completely reset owned and unowned PTPs for this project
    const { value: updatedProject } = await pulseCoreDb
      .collection('testTdgProjects')
      .findOneAndUpdate(
        { _id: projectId },
        {
          $set: {
            orgTpIds: freeToOwnPtps,
            extraOrgTpIds: pTpIdsOwnedByOtherProjects
          }
        },
        {
          returnOriginal: false,
          session,
        }
      )

    result = updatedProject
  })


  return result
}

module.exports = updatePtps

const getPtpsOwnedByOtherProjects = (currentProjectId, pTpIds) => [{
  $match: {
    _id: { $ne: currentProjectId }
  }
}, { $unwind: '$orgTpIds' }, {
  $match: {
    orgTpIds: {
      $in: pTpIds
    }
  }
}, {
  $project: {
    _id: '$orgTpIds'
  }
}]
