const _ = require('lodash')

const treatmentPlansDiff = async (
  parent,
  { teamId, nodeId, parentId },
  { pulseCoreDb }
) => {
  // step 1: get the treatment plans that are enabled on a given node
  // (and prevent breakage if there aren't any)
  const team = await pulseCoreDb
    .collection('roles')
    .findOne({ _id: teamId })

  let { resources } = team

  if (!resources) resources = [{ nodeId, treatmentPlans: [] }]

  let targetResourceObj = resources.find(
    ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
  ) || { nodeId }

  let enabledTreatmentPlans = targetResourceObj.treatmentPlans
  if (!enabledTreatmentPlans) enabledTreatmentPlans = []

  // step 2: get the total set of toggleable tps to diff against
  let toggleableTreatmentPlans = []
  if (!parentId) { // it must be a tool, so its options are drawn from master list
    toggleableTreatmentPlans = await pulseCoreDb
      .collection('indications').find().toArray()
  } else { // it needs to grab its parent's accounts
    let parentResources = resources.find(
      ({ nodeId: resourceNodeId }) => resourceNodeId === parentId
    )

    toggleableTreatmentPlans = (parentResources && parentResources.treatmentPlans) || []
  }

  const enabledTreatmentPlansHash = _.mapValues(
    _.keyBy(enabledTreatmentPlans, '_id'),
    ({ regimens }) => _.keyBy(regimens, '_id')
  )

  toggleableTreatmentPlans.forEach(indObj => {
    if (enabledTreatmentPlansHash[indObj._id]) {
      indObj.enabled = true

      indObj.regimens.forEach(reg => {
        if (enabledTreatmentPlansHash[indObj._id][reg._id]) {
          reg.enabled = true
        } else {
          reg.enabled = false
        }
      })
    } else {
      indObj.enabled = false
      indObj.regimens.forEach(reg => { reg.enabled = false })
    }
  })

  return toggleableTreatmentPlans
}

module.exports = treatmentPlansDiff
