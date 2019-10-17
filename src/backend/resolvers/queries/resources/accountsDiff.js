const _ = require('lodash')

const accountsDiff = async (
  parent,
  { teamId, nodeId, parentId },
  { pulseCoreDb }
) => {
  // step 1: get the accounts that are enabled on a given node
  // (and prevent breakage if there aren't any)
  const team = await pulseCoreDb
    .collection('roles')
    .findOne({ _id: teamId })

  let { resources } = team

  if (!resources) resources = [{ nodeId, accounts: [] }]

  let targetResourceObj = resources.find(
    ({ nodeId: resourceNodeId }) => resourceNodeId === nodeId
  ) || { nodeId }

  let enabledAccounts = targetResourceObj.accounts
  if (!enabledAccounts) enabledAccounts = []

  // step 2: get the total set of toggleable accounts to diff against
  let toggleableAccounts = []
  if (!parentId) { // it must be a tool, so its options are drawn from master list
    toggleableAccounts = await pulseCoreDb
      .collection('organizations')
      .find({ toolIds: nodeId })
      .toArray()
  } else { // it needs to grab its parent's accounts
    let parentResources = resources.find(
      ({ nodeId: resourceNodeId }) => resourceNodeId === parentId
    )

    toggleableAccounts = (parentResources && parentResources.accounts) || []
  }

  const enabledAccountsHash = _.keyBy(enabledAccounts, '_id')
  const [active, inactive] = _.partition(toggleableAccounts, ({ _id }) => enabledAccountsHash[_id])

  return { active, inactive }
}

module.exports = accountsDiff
