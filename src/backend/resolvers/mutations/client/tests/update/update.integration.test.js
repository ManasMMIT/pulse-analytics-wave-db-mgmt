const connectToTestCluster = require('../../../../../utils/connectToTestCluster')
const updateClient = require('../../update')
const getMockMongoClient = require('../../../../../utils/getMockMongoClient')

describe('Updating a client works and cascade updates as needed', () => {
  let mongoConnection
  let mongoClient
  let pulseCoreDb
  let pulseDevDb
  let session

  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
    pulseCoreDb = mongoConnection.db('pulse-core')
    pulseDevDb = mongoConnection.db('pulse-dev')
  })

  beforeEach(async () => {
    session = mongoConnection.startSession()
    session.startTransaction()

    mongoClient = getMockMongoClient(session)
  })

  afterEach(async () => {
    await session.abortTransaction()
    session.endSession()
  })

  test.todo('client.name and .description are updated')
  // 01 create mock client w session
  // 02 run resolver w mocked client._id
  // 03 find mocked client within session
  // 04 expect()

  afterAll(async () => {
    await mongoConnection.close()
  })
})
