// const _ = require('lodash')

const toggleAccount = async (
  parent,
  { input: { teamId, nodeId, account, shouldBeAdded } },
  { pulseCoreDb },
  info
) => {
  debugger
  const rolesCollection = await pulseCoreDb.collection('roles')

  const team = await rolesCollection.findOne({ _id: teamId })

  if (shouldBeAdded) {
    const resources = team.resources || [{ nodeId, accounts: [] }]
  
    let targetResourceObj = resources.find(
      ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
    ) || { nodeId }
  
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

    await rolesCollection.updateOne(
      { _id: teamId },
      {
        $set: {
          resources,
        }
      },
    )
  } else {
    await rolesCollection.updateOne(
      { _id: teamId, resources: { nodeId } },
      {
        $pull: {
          'resources.$.accounts': { _id: account._id }
        }
      },
    )
  }
}

module.exports = toggleAccount
