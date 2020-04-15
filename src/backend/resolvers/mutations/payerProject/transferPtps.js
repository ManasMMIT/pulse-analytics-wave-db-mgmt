const { ObjectId } = require('mongodb')

// TODO Plan of Attack
// 1. Find all orgTpId owners
// 2. Move orgTps from owners' orgTpIds array to extraOrgTps array
// 3. Pull orgTps from incoming project's extraOrgTpIds (just in case)
// 4. add orgTps into incoming project's orgTpIds array

const transferPtps = async (
  parent,
  {
    input: {
      projectId,
      orgTpIds,
    }
  },
  { pulseCoreDb },
  info
) => {
  projectId = ObjectId(projectId)
  orgTpIds = orgTpIds.map(ObjectId)

  return 'WIP, no op...'
}

module.exports = transferPtps
