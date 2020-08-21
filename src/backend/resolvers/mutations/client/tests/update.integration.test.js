const connectToTestCluster = require('../../../../utils/connectToTestCluster')
const updateClient = require('../update')
const getMockMongoClient = require('../../../../utils/getMockMongoClient')

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

  test('Can invoke resolver successfully with monkey-patched session', async () => {
    await updateClient(
      null,
      {
        input: {
          _id: '5d7a0c81-99b2-4c71-a0bc-cd96eb3974a4',
          description: 'Jon Test',
        },
      },
      {
        mongoClient,
        coreClients: pulseCoreDb.collection('clients'),
        coreRoles: pulseCoreDb.collection('roles'),
        coreUsers: pulseCoreDb.collection('users'),
        pulseDevDb,
      },
      null
    )

    const updatedClient = await pulseCoreDb
      .collection('clients')
      .findOne({ _id: '5d7a0c81-99b2-4c71-a0bc-cd96eb3974a4' }, { session })

    expect(updatedClient.description).toEqual('Jon Test')
  })

  afterAll(async () => {
    await mongoConnection.close()
  })
})
