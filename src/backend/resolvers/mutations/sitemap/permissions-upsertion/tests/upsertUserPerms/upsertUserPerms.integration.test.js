const _ = require('lodash')
const connectToTestCluster = require('../../../../../../utils/connectToTestCluster')
const upsertUserPerms = require('../../upsertUserPerms')

const { ROLE_1, ROLE_2 } = require('./mocks/input/roles')

const OUTPUT_userFNodesResources = require('./mocks/output/user-f-nodes-resources')
const OUTPUT_userGNodesResources = require('./mocks/output/user-G-nodes-resources')

const { USER_F, USER_G } = require('./mocks/input/users')
const indications = require('./mocks/input/indications')
const regimens = require('./mocks/input/regimens')
const accounts = require('./mocks/input/accounts')

describe(`Upsertion of a users' nodes' resources works`, () => {
  let mongoConnection
  let pulseCoreDb
  let pulseDevDb
  let session
  let masterListItemsById

  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
    pulseCoreDb = mongoConnection.db('pulse-core')
    pulseDevDb = mongoConnection.db('pulse-dev')

    masterListItemsById = {
      ..._.keyBy(accounts, '_id'),
      ..._.keyBy(indications, '_id'),
      ..._.keyBy(regimens, '_id'),
    }
  })

  beforeEach(async () => {
    // "At any given time, you can have at most one open transaction for a session."
    // (ref: https://docs.mongodb.com/manual/reference/method/Session.startTransaction/)
    session = mongoConnection.startSession()
    session.startTransaction()

    // Load up the existing organizations, indications, regimens collection with mock data

    await pulseCoreDb
      .collection('organizations')
      .insertMany(accounts, { session })
    await pulseCoreDb
      .collection('indications')
      .insertMany(indications, { session })
    await pulseCoreDb.collection('regimens').insertMany(regimens, { session })
    await pulseCoreDb
      .collection('roles')
      .insertMany([ROLE_1, ROLE_2], { session })
  })

  afterEach(async () => {
    await session.abortTransaction()
    session.endSession()
  })

  test('Upserts users.nodes.resources for a user on a single team', async () => {
    await upsertUserPerms({
      userId: USER_F._id,
      pulseDevDb,
      pulseCoreDb,
      masterListItemsById,
      session,
    })

    const usersNodesResources = await pulseDevDb
      .collection('users.nodes.resources')
      .findOne({ _id: USER_F._id }, { session })

    expect(Boolean(usersNodesResources)).toBe(true)

    // ? Jest doesn't faithfully coerce both side's ObjectIds, so brute-force comparing results as strings for now.
    expect(JSON.stringify(usersNodesResources.resources)).toStrictEqual(
      JSON.stringify(OUTPUT_userFNodesResources)
    )
  })

  test('Upserts users.nodes.resources for a user on multiple teams with non-conflicting nodes', async () => {
    await upsertUserPerms({
      userId: USER_G._id,
      pulseDevDb,
      pulseCoreDb,
      masterListItemsById,
      session,
    })

    const usersNodesResources = await pulseDevDb
      .collection('users.nodes.resources')
      .findOne({ _id: USER_G._id }, { session })

    expect(Boolean(usersNodesResources)).toBe(true)

    // ? Jest doesn't faithfully coerce both side's ObjectIds, so brute-force comparing results as strings for now.
    expect(JSON.stringify(usersNodesResources.resources)).toStrictEqual(
      JSON.stringify(OUTPUT_userGNodesResources)
    )
  })

  afterAll(async () => {
    await mongoConnection.close()
  })
})
