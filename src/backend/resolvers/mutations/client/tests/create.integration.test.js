const createClient = require('../create')
const connectToTestCluster = require('../../../../utils/connectToTestCluster')

const NON_COLLIDING_DESCRIPTION =
  'SUPER_UNIQUE_DESCRIPTION_LAST_UPDATED_JULY_28_2020!@!@'

describe('Create client mutation', () => {
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  let mongoClient
  let coreClients
  let coreRoles
  let context

  beforeAll(async () => {
    mongoClient = await connectToTestCluster()
    const pulseCore = await mongoClient.db('pulse-core')
    coreClients = pulseCore.collection('clients')
    coreRoles = pulseCore.collection('roles')
    context = { coreClients, coreRoles, mongoClient }
  })

  afterAll(async () => {
    await mongoClient.close()
  })

  afterEach(async () => {
    await Promise.all([
      coreClients.deleteOne({ description: NON_COLLIDING_DESCRIPTION }),
      coreRoles.deleteOne({ name: `${NON_COLLIDING_DESCRIPTION}-admin` }),
    ])
  })

  test('Takes description as input and creates a new doc in pulse-core.clients', async () => {
    const input = { description: NON_COLLIDING_DESCRIPTION }
    await createClient(null, { input }, context)
    const newDoc = await coreClients.findOne(input)

    expect(Boolean(newDoc)).toEqual(true)
  })

  test('Errors when description is blank', async () => {
    const input = { description: undefined }
    const erroneousOp = createClient(null, { input }, context)
    await expect(erroneousOp).rejects.toThrowError()

    // ! in case this test ever fails, don't pollute db
    await coreClients.deleteOne({ description: undefined })
  })

  test('Adds a default admin team to pulse-core.roles', async () => {
    const input = { description: NON_COLLIDING_DESCRIPTION }
    const newClient = await createClient(null, { input }, context)
    const DEFAULT_ROLE_NAME = `${NON_COLLIDING_DESCRIPTION}-admin`
    const defaultAdminRole = await coreRoles
      .find({ 'client._id': newClient._id })
      .toArray()

    expect(defaultAdminRole.length).toBe(1)
    expect(defaultAdminRole[0].name).toBe(DEFAULT_ROLE_NAME)
  })
})
