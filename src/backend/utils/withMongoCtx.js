const getMockMongoClient = require('./getMockMongoClient')

const withMongoCtx = (mongoConnection) => async (fn) => {
  let session = mongoConnection.startSession()
  let pulseCoreDb = mongoConnection.db('pulse-core')
  let pulseDevDb = mongoConnection.db('pulse-dev')
  let ctx = {
    mongoClient: getMockMongoClient(session),
    session,

    coreClients: pulseCoreDb.collection('clients'),
    coreUsers: pulseCoreDb.collection('users'),
    coreRoles: pulseCoreDb.collection('roles'),

    pulseCoreDb,
    pulseDevDb,

    mongoOpts: { session },
    mongoConnection,
  }

  session.startTransaction()
  await fn(ctx)
  await session.abortTransaction()
  session.endSession()
}

module.exports = withMongoCtx
