const _ = require('lodash')
const connectToTestCluster = require('../../../../utils/connectToTestCluster')
const updateClient = require('../update')
const {
  mockDuplication,
} = require('../../../../test-utils/duplication/mockDuplication')
const {
  getDestinationDupes,
} = require('../../../../test-utils/duplication/checkDuplication')
const withMongoContext = require('../../../../utils/withMongoContext')
const CLIENT_DUPLICATION_POLICY = require('../duplicationPolicy')

const mockData = require('./mocks/update-data')

const NEW_DESCRIPTION = 'NEW DESCRIPTION'

describe('Updating a client works and cascade updates as needed', () => {
  let mongoConnection
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
  })

  const attemptUpdate = (context) =>
    updateClient(
      null,
      {
        input: {
          _id: mockData.clientA._id,
          description: NEW_DESCRIPTION,
        },
      },
      context
    )

  const expectation = {
    ...mockData.clientA,
    name: NEW_DESCRIPTION,
    description: NEW_DESCRIPTION,
  }

  test('Description for given client._id is modified', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await mockDuplication(
        {
          policy: CLIENT_DUPLICATION_POLICY,
          mockSourceDatum: mockData.clientA,
          mockDestinationData: mockData.MOCK_DB_DATA,
        },
        context
      )

      await attemptUpdate(context)

      const updatedClient = await context.coreClients.findOne(
        { _id: mockData.clientA._id },
        context.mongoOpts
      )
      expect(updatedClient).toEqual(expectation)
    }))

  // FUTURE: rely on util/dupe:isInSync module to enforce consistency in duplication behavior,
  // so individual destination collections do not need to be checked by users of dupe module
  // e.g.
  // await dupeTestUtils.isInSync(
  //   CLIENT_DUPLICATION_POLICY,
  //   mockData.clientA._id,
  //   context
  // )

  test('All users get duplicated updated client objects', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await mockDuplication(
        {
          policy: CLIENT_DUPLICATION_POLICY,
          mockSourceDatum: mockData.clientA,
          mockDestinationData: mockData.MOCK_DB_DATA,
        },
        context
      )

      await attemptUpdate(context)

      let clientDupes = await getDestinationDupes(
        CLIENT_DUPLICATION_POLICY.destinations[0],
        expectation._id,
        context
      )
      expect(
        clientDupes.every((dupe) => _.isEqual(dupe, expectation))
      ).toBeTruthy()
    }))

  test('All roles get duplicated updated client objects', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await mockDuplication(
        {
          policy: CLIENT_DUPLICATION_POLICY,
          mockSourceDatum: mockData.clientA,
          mockDestinationData: mockData.MOCK_DB_DATA,
        },
        context
      )

      await attemptUpdate(context)

      let clientDupes = await getDestinationDupes(
        CLIENT_DUPLICATION_POLICY.destinations[1],
        expectation._id,
        context
      )
      expect(
        clientDupes.every((dupe) => _.isEqual(dupe, expectation))
      ).toBeTruthy()
    }))

  test('All user.sitemaps get duplicated updated client objects', async () =>
    withMongoContext(mongoConnection)(async (context) => {
      await mockDuplication(
        {
          policy: CLIENT_DUPLICATION_POLICY,
          mockSourceDatum: mockData.clientA,
          mockDestinationData: mockData.MOCK_DB_DATA,
        },
        context
      )

      await attemptUpdate(context)

      let clientDupes = await getDestinationDupes(
        CLIENT_DUPLICATION_POLICY.destinations[2],
        expectation._id,
        context
      )
      expect(
        clientDupes.every((dupe) => _.isEqual(dupe, expectation))
      ).toBeTruthy()
    }))

  afterAll(async () => {
    await mongoConnection.close()
  })
})
