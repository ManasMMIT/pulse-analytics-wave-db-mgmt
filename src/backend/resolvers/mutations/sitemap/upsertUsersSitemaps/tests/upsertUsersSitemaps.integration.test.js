const _ = require('lodash')
const connectToTestCluster = require('../../../../../utils/connectToTestCluster')
const upsertUsersSitemaps = require('../upsertUsersSitemaps')

const { ROLE_D, ROLE_E, ROLE_F } = require('./mocks/input/roles')

const OUTPUT_userFSitemap = require('./mocks/output/user-f-sitemap')
const OUTPUT_userGSitemap = require('./mocks/output/user-g-sitemap')
const OUTPUT_userHSitemap = require('./mocks/output/user-h-sitemap')

const { USER_F, USER_G, USER_H } = require('./mocks/input/users')

describe(`Upsertion of multiple users' sitemaps works`, () => {
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
      .insertMany([ROLE_D, ROLE_E, ROLE_F], { session })
  })

  afterEach(async () => {
    await session.abortTransaction()
    session.endSession()
  })

  test('Upserting a single user works', async () => {
    await upsertUsersSitemaps({
      users: [USER_H],
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const userSitemap = await pulseDevDb
      .collection('users.sitemaps')
      .findOne({ _id: USER_H._id }, { session })

    expect(Boolean(userSitemap)).toBe(true)
    expect(userSitemap.sitemap).toStrictEqual(OUTPUT_userHSitemap)
  })

  test('Upserting multiple users works', async () => {
    await upsertUsersSitemaps({
      users: [USER_F, USER_G, USER_H],
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const usersSitemapsOutput = await pulseDevDb
      .collection('users.sitemaps')
      .find({ _id: { $in: [USER_F._id, USER_G._id, USER_H._id] } }, { session })
      .toArray()

    expect(usersSitemapsOutput).not.toStrictEqual([])
    expect(usersSitemapsOutput).toHaveLength(3)

    const usersSitemapsHash = _.keyBy(usersSitemapsOutput, '_id')

    expect(usersSitemapsHash[USER_F._id].sitemap).toStrictEqual(
      OUTPUT_userFSitemap
    )

    expect(usersSitemapsHash[USER_G._id].sitemap).toStrictEqual(
      OUTPUT_userGSitemap
    )

    expect(usersSitemapsHash[USER_H._id].sitemap).toStrictEqual(
      OUTPUT_userHSitemap
    )
  })

  afterAll(async () => {
    await mongoConnection.close()
  })
})
