const getMockMongoClient = require('./getMockMongoClient')

const withMongoContext = (mongoConnection) => async (callback) => {
  let session = mongoConnection.startSession()
  let pulseCoreDb = mongoConnection.db('pulse-core')
  let pulseDevDb = mongoConnection.db('pulse-dev')

  let context = {
    mongoClient: getMockMongoClient(session),
    mongoConnection,
    mongoOpts: { session },

    pulseCoreDb,
    pulseDevDb,

    coreClients: pulseCoreDb.collection('clients'),
    coreUsers: pulseCoreDb.collection('users'),
    coreRoles: pulseCoreDb.collection('roles'),
  }

  session.startTransaction()
  await callback(context)
  await session.abortTransaction()
  session.endSession()
}

module.exports = withMongoContext
