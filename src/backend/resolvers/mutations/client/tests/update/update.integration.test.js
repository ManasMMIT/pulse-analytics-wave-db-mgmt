const _ = require('lodash')
const connectToTestCluster = require('../../../../../utils/connectToTestCluster')
const withMongoCtx = require('../../../../../utils/withMongoCtx')
const updateClient = require('../../update')
const dupeTestUtils = require('../../../../../utils/dupe/testUtils')
const CLIENT_DUPLICATION_POLICY = require('../../duplicationPolicy')

const mockData = require('./mocks/data')

const NEW_DESCRIPTION = 'NEW DESCRIPTION'

describe('Updating a client works and cascade updates as needed', () => {
  let mongoConnection
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
  })

  const attemptUpdate = (ctx) =>
    updateClient(
      null,
      {
        input: {
          _id: mockData.clientA._id,
          description: NEW_DESCRIPTION,
        },
      },
      ctx
    )

  const expectation = {
    ...mockData.clientA,
    name: NEW_DESCRIPTION,
    description: NEW_DESCRIPTION,
  }

  test('Description for given client._id is modified', async () =>
    withMongoCtx(mongoConnection)(async (ctx) => {
      await dupeTestUtils.mockDuplication(
        CLIENT_DUPLICATION_POLICY,
        mockData.clientA,
        mockData.MOCK_DB_DATA,
        ctx
      )

      await attemptUpdate(ctx)

      const updatedClient = await ctx.coreClients.findOne(
        { _id: mockData.clientA._id },
        ctx.mongoOpts
      )
      expect(updatedClient).toEqual(expectation)
    }))

  // FUTURE: rely on util/dupe:isInSync module to enforce consistency in duplication behavior,
  // so individual destination collections do not need to be checked by users of dupe module
  // e.g.
  // await dupeTestUtils.isInSync(
  //   CLIENT_DUPLICATION_POLICY,
  //   mockData.clientA._id,
  //   ctx
  // )

  test('All roles get duplicated updated client objects', async () =>
    withMongoCtx(mongoConnection)(async (ctx) => {
      await dupeTestUtils.mockDuplication(
        CLIENT_DUPLICATION_POLICY,
        mockData.clientA,
        mockData.MOCK_DB_DATA,
        ctx
      )

      await attemptUpdate(ctx)

      let userDupes = await dupeTestUtils.getDestinationDupes(
        CLIENT_DUPLICATION_POLICY.destinations[0],
        expectation._id,
        ctx
      )
      expect(
        userDupes.every((dupe) => _.isEqual(dupe, expectation))
      ).toBeTruthy()
    }))

  test('All users get duplicated updated client objects', async () =>
    withMongoCtx(mongoConnection)(async (ctx) => {
      await dupeTestUtils.mockDuplication(
        CLIENT_DUPLICATION_POLICY,
        mockData.clientA,
        mockData.MOCK_DB_DATA,
        ctx
      )

      await attemptUpdate(ctx)

      let rolesDupes = await dupeTestUtils.getDestinationDupes(
        CLIENT_DUPLICATION_POLICY.destinations[1],
        expectation._id,
        ctx
      )
      expect(
        rolesDupes.every((dupe) => _.isEqual(dupe, expectation))
      ).toBeTruthy()
    }))

  test('All user.sitemaps get duplicated updated client objects', async () =>
    withMongoCtx(mongoConnection)(async (ctx) => {
      await dupeTestUtils.mockDuplication(
        CLIENT_DUPLICATION_POLICY,
        mockData.clientA,
        mockData.MOCK_DB_DATA,
        ctx
      )

      await attemptUpdate(ctx)

      let sitemapsDupes = await dupeTestUtils.getDestinationDupes(
        CLIENT_DUPLICATION_POLICY.destinations[2],
        expectation._id,
        ctx
      )
      expect(
        sitemapsDupes.every((dupe) => _.isEqual(dupe, expectation))
      ).toBeTruthy()
    }))

  afterAll(async () => {
    await mongoConnection.close()
  })
})
