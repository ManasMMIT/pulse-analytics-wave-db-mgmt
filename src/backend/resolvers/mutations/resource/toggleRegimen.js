const { ObjectId } = require('mongodb')
const _ = require('lodash')

const toggleRegimen = async (
  parent,
  {
    input: {
      shouldBeAdded,
      regimen,
      indicationId,
      teamId,
      nodeId,
    }
  },
  { pulseCoreDb },
  info
) => {
  // step 1: format the regimen object and ids as needed
  regimen._id = ObjectId(regimen._id)
  regimen = _.omit(regimen, ['enabled'])
  indicationId = ObjectId(indicationId)

  // step 2: get the regimens array by traversing as follows:
  // ! team => resources => correct resource obj => treatmentPlans arr
  // ! => correct indication obj => regimens array
  // ASSUMPTION: the data structure as described above will already exist
  const rolesCollection = pulseCoreDb.collection('roles')

  const team = await rolesCollection.findOne({ _id: teamId })

  const { resources } = team

  const targetResourceObj = resources.find(
    ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
  )

  const { treatmentPlans } = targetResourceObj

  const targetIndObj = treatmentPlans.find(
    ({ _id: targetIndId }) => targetIndId.equals(indicationId)
  )

  const targetRegimens = targetIndObj.regimens

  // step 3: edit the targetRegimens array as needed, then update the resources
  // array accordingly to prepare it for mongodb updateOne
  if (shouldBeAdded) {
    targetRegimens.push(regimen)
  } else {
    const regimenIdx = targetRegimens.findIndex(
      ({ _id: regimenId }) => regimenId.equals(regimen._id)
    )

    targetRegimens.splice(regimenIdx, 1)
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

module.exports = toggleRegimen
