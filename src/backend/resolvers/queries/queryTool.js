const queryToolAccounts = async (parent, args, { pulseRawDb, pulseCoreDb }, info) => {
  const accountsWithConnections = await pulseRawDb.collection('queryTool.phase2')
    .find({ connections: { $exists: true } })
    .toArray()

  return accountsWithConnections.map(account => ({
    ...account,
    organization: `${ account.organization } (${ account.type })`,
  }))
}

module.exports = queryToolAccounts
