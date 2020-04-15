const { ObjectId } = require('mongodb')
// const _ = require('lodash')

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
  { pulseCoreDb },
  info
) => {
  organizationIds = organizationIds.map(ObjectId)
  treatmentPlanIds = treatmentPlanIds.map(ObjectId)
  projectId = ObjectId(projectId)

  // WIP for after scaffolding:
  // const {
  //   orgTpIds,
  // } = await pulseCoreDb.collection('testTdgProjects')
  //   .findOne({ _id: projectId }, { _id: 0 })

  // const notOwnedPtps = _.difference(
  //   ptps,
  //   orgTpIds,
  // )


  // pulseCoreDb.collection('testTdgProjects')
  //   .updateOne(
  //     {
  //       _id: projectId,
  //     },
  //     {
  //       $addToSet: {
  //         $extraOrgTpIds:
  //       }
  //     }
  //   )

  return 'WIP, no op...'
}

module.exports = updatePtps
