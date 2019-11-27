const queryToolAccounts = async (parent, args, { pulseCoreDb }, info) => {
  const accountsWithConnections = await pulseCoreDb.collection('organizations')
    .find({ connections: { $exists: true } })
    .toArray()

  return accountsWithConnections.map(account => ({
    ...account,
    organization: `${ account.organization } (${ account.type })`,
  }))
}

module.exports = queryToolAccounts
