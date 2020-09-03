const deleteClient = require('../delete')
const withMongoContext = require('../../../../utils/withMongoContext')
const {
  mockDuplication,
} = require('../../../../test-utils/duplication/mockDuplication')
const CLIENT_DUPLICATION_POLICY = require('../duplicationPolicy')
const mockData = require('./mocks/delete-data')
const connectToTestCluster = require('../../../../utils/connectToTestCluster')

describe('Deleting a client works and cascade updates as needed', () => {
  let mongoConnection
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
  })

  afterAll(async () => {
    await mongoConnection.close()
  })

  const mockAuth0 = {
    users: {
      delete: jest.fn().mockResolvedValue(),
    },
  }

  const attemptDelete = async (context) => {
    await mockDuplication(
      {
        policy: CLIENT_DUPLICATION_POLICY,
        mockSourceDatum: mockData.clientA,
        mockDestinationData: mockData.MOCK_DB_DATA,
      },
      context
    )

    await deleteClient(
      null,
      {
        input: {
          _id: mockData.clientA._id,
        },
      },
      { ...context, auth0: mockAuth0 }
    )
  }

  test('Client for given client._id is deleted', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await attemptDelete(context)

      const result = await context.coreClients.findOne(
        { _id: mockData.clientA._id },
        context.mongoOpts
      )

      expect(result).toBeFalsy()
    }))

  test('All related roles/teams are deleted', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await attemptDelete(context)

      const result = await context.coreRoles
        .find({ 'client._id': mockData.clientA._id }, context.mongoOpts)
        .toArray()

      expect(result).toHaveLength(0)
    }))

  test('All related users are deleted', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await attemptDelete(context)

      const result = await context.coreUsers
        .find({ 'client._id': mockData.clientA._id }, context.mongoOpts)
        .toArray()

      expect(result).toHaveLength(0)
    }))

  test('All related users.sitemaps are deleted', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await attemptDelete(context)

      const result = await context.pulseDevDb
        .collection('users.sitemaps')
        .find({ 'client._id': mockData.clientA._id }, context.mongoOpts)
        .toArray()

      expect(result).toHaveLength(0)
    }))

  test('All related users.nodes.resources are deleted', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      const clientUsers = await context.pulseCoreDb
        .collection('users')
        .find({ 'client._id': mockData.clientA._id }, context.mongoOpts)
        .toArray()

      const clientUsersIds = clientUsers.map(({ _id }) => _id)

      await attemptDelete(context)

      const result = await context.pulseDevDb
        .collection('users.nodes.resources')
        .find({ _id: { $in: clientUsersIds } }, context.mongoOpts)
        .toArray()

      expect(result).toHaveLength(0)
    }))

  test("Call was made to delete each client's users from auth0", async () =>
    withMongoContext(mongoConnection)(async (context) => {
      mockAuth0.users.delete.mockReset()
      await attemptDelete(context)

      expect(mockAuth0.users.delete).toHaveBeenCalledTimes(2)
      expect(mockAuth0.users.delete).toHaveBeenCalledWith(
        mockData.MOCK_DB_DATA['pulse-core'].users[0]._id
      )
      expect(mockAuth0.users.delete).toHaveBeenCalledWith(
        mockData.MOCK_DB_DATA['pulse-core'].users[1]._id
      )
    }))
})
