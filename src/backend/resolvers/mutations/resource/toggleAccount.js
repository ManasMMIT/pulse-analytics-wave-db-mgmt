const _ = require('lodash')

const toggleAccount = async (
  parent,
  { input: { teamId, nodeId, account, shouldBeAdded } },
  { pulseCoreDb },
  info
) => {
  debugger
  const rolesCollection = await pulseCoreDb.collection('roles')

  const team = await rolesCollection.findOne({ _id: teamId })

  const resources = team.resources || [{ nodeId, accounts: [] }]

  let targetResourceObj = resources.find(
    ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
  ) || { nodeId, accounts: [] }

  if (shouldBeAdded) {
    if (!targetResourceObj.accounts) {
      targetResourceObj.accounts = [account]
    } else {
      targetResourceObj.accounts.push(account)
    }

    const idx = resources.findIndex(
      ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
    )

    idx === -1
      ? resources.push(targetResourceObj)
      : resources[idx] = targetResourceObj
  } else {
    _.pullAllBy(targetResourceObj.accounts, [{ _id: account._id }], '_id')

    const idx2 = resources.findIndex(
      ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
    )
    if (idx2 > -1) resources.splice(idx2, 1)
    debugger
  }
debugger
  await rolesCollection.updateOne(
    { _id: teamId },
    {
      $set: {
        resources,
      }
    },
  )
}

module.exports = toggleAccount
