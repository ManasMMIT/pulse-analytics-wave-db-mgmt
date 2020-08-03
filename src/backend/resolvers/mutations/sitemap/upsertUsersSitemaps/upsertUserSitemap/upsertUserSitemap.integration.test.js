const connectToTestCluster = require('../../../../../utils/connectToTestCluster')
const upsertUserSitemap = require('./upsertUserSitemap')

const { ROLE_A, ROLE_B, ROLE_C } = require('./mocksInput/roles')

const OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers = require('./getCombinedSitemaps/tests/mocks/output/two-disjoint-sitemaps-with-third-overlapping-others')

const { USER_A, USER_C } = require('./mocksInput/users')

describe(`Upsertion of a single user's sitemap works`, () => {
  let mongoConnection
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
    // "At any given time, you can have at most one open transaction for a session."
    // (ref: https://docs.mongodb.com/manual/reference/method/Session.startTransaction/)
    session = mongoConnection.startSession()
    session.startTransaction()

    // Load up the existing roles collection with mock roles
    await pulseCoreDb
      .collection('roles')
      .insertMany([ROLE_A, ROLE_B, ROLE_C], { session })
  })

  afterEach(async () => {
    await session.abortTransaction()
    session.endSession()
  })

  test('Schema (shallow keys) of users.sitemaps output is correct', async () => {
    await upsertUserSitemap({
      user: USER_C,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const expectedKeys = [
      '_id',
      'username',
      'sitemap',
      'teams',
      'client',
      'defaultLandingPath',
      'schemaVersion',
      'updatedAt',
      'createdAt',
    ]

    const userSitemap = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_C._id }, { session })

    expect(Object.keys(userSitemap).sort()).toStrictEqual(expectedKeys.sort())
  })

  test('Newly created user gets combined sitemap inserted into users.sitemaps', async () => {
    const isUserInUsersSitemaps = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_C._id }, { session })

    expect(Boolean(isUserInUsersSitemaps)).toBe(false)

    await upsertUserSitemap({
      user: USER_C,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const userSitemap = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_C._id }, { session })

    expect(Boolean(userSitemap)).toBe(true)
    expect(userSitemap.sitemap).toStrictEqual(
      OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers
    )
  })

  test('Existing user sees new combined sitemap replace old one in users.sitemaps', async () => {
    // mock the user already existing in users.sitemaps by inserting the user first
    // with a random empty sitemap
    await pulseDevDb.collection('users.sitemaps').insertOne(
      {
        ...USER_C,
        sitemap: {
          tools: [
            {
              _id: 100,
              name: 'TEST TOOL',
              type: 'tool',
              parentId: null,
              order: 50,
            },
          ],
        },
      },
      { session }
    )

    const existingUserInUsersSitemaps = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_C._id }, { session })

    const oldSitemap = existingUserInUsersSitemaps.sitemap

    expect(Boolean(existingUserInUsersSitemaps)).toBe(true)

    await upsertUserSitemap({
      user: USER_C,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const updatedUserSitemapEntry = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_C._id }, { session })

    expect(Boolean(updatedUserSitemapEntry)).toBe(true)

    expect(updatedUserSitemapEntry.sitemap).toStrictEqual(
      OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers
    )

    expect(oldSitemap).not.toStrictEqual(
      OUTPUT_twoDisjointSitemapsWithThirdOverlappingOthers
    )
  })

  // ! due to cruft users in our core collection, we actually do
  // ! have users who belong to 0 teams; does it break upsertUserSitemap? shouldn't
  test('User without roles gets users.sitemaps entry with blank sitemap', async () => {
    const testUserId = 12341234

    await upsertUserSitemap({
      user: {
        _id: testUserId,
        username: 'TEST_USER',
      },
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const userSitemap = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: testUserId }, { session })

    expect(Boolean(userSitemap)).toBe(true)
    expect(userSitemap.sitemap).toStrictEqual({})
  })

  test('User without defaultLanding.path sees defaultLandingPath: null in users.sitemaps', async () => {
    await upsertUserSitemap({
      user: USER_C,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const userSitemap = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_C._id }, { session })

    expect(userSitemap.defaultLandingPath).toBe(null)
  })

  test('User with defaultLanding.path sees defaultLandingPath in users.sitemaps', async () => {
    await upsertUserSitemap({
      user: USER_A,
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const userSitemap = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_A._id }, { session })

    expect(userSitemap.defaultLandingPath).toBe(USER_A.defaultLanding.path)
  })

  afterAll(async () => {
    await mongoConnection.close()
  })
})
