const { ObjectId } = require('mongodb')
const _ = require('lodash')

const toggleIndication = async (
  parent,
  { input: { teamId, nodeId, indication, shouldBeAdded } },
  { pulseCoreDb },
  info
) => {
  // step 1: format the indication object as needed
  indication._id = ObjectId(indication._id)
  indication = _.omit(indication, ['enabled'])
  indication.regimens = [] // whether toggling on or off, enabled regimens are reset

  // step 2: get the target treatment plans array for the given team and given node,
  // take into account cases where resources, resource object, treatment plans don't exist yet
  const rolesCollection = pulseCoreDb.collection('roles')

  const team = await rolesCollection.findOne({ _id: teamId })

  let { resources } = team

  if (!resources) resources = [{ nodeId, treatmentPlans: [] }]

  let targetResourceObj = resources.find(
    ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
  ) || { nodeId, treatmentPlans: [] }

  let enabledTreatmentPlans = targetResourceObj.treatmentPlans
  if (!enabledTreatmentPlans) enabledTreatmentPlans = []

  // step 3: edit the enabledTreatmentPlans array as needed, then update the resources
  // array accordingly to prepare it for mongodb updateOne

  const resourceIdx = resources.findIndex(
    ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
  )

  if (shouldBeAdded) {
    enabledTreatmentPlans.push(indication)

    resourceIdx === -1
      ? resources.push(targetResourceObj)
      : resources[resourceIdx] = targetResourceObj // this side probably not needed
  } else {
    debugger
    enabledTreatmentPlans = enabledTreatmentPlans.filter(tp => !tp._id.equals(indication._id))

    resources[resourceIdx].treatmentPlans = enabledTreatmentPlans
  }

  await rolesCollection.updateOne(
    { _id: teamId },
    {
      $set: {
        resources,
      }
    },
  )
}

module.exports = toggleIndication
