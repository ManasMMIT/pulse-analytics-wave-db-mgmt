const getMockMongoClient = (session) => {
  // ! HACK: Monkey-patch session.withTransaction to neutralize its functionality
  // ! in the resolver during testing; otherwise the transaction will actually commit;
  // ! this also means that in the jest file, DO NOT USE withTransaction
  session.withTransaction = async (func) => await func()

  const mockMongoClient = { startSession: () => session }

  return mockMongoClient
}

module.exports = getMockMongoClient
