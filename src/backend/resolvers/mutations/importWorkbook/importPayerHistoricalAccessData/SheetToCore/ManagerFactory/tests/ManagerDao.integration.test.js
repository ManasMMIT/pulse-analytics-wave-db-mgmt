const ManagerDao = require('../ManagerDao')
const {
  mockOrgTpsHistory,
  mockTestCollectionName,
} = require('./mocks/input/managerDaoMocks')
const {
  mockUpsertQualityOfAccessData,
  mockUpsertAdditionalCriteriaData,
  mockUpsertPolicyLinkData,
} = require('./mocks/output/managerDaoMocks')

const qualityAccessMocks = require('./mocks/output/qualityOfAccessManagerMocks')
const additionalCriteriaMocks = require('./mocks/output/additionalCriteriaManagerMocks')
const policyLinksMocks = require('./mocks/output/policyLinkManagerMocks')
const connectToTestCluster = require('../../../../../../../utils/connectToTestCluster')

describe('ManagerDao', () => {
  jest.setTimeout(60000) // ! needed to adjust jest timeout for slower connections

  let db
  let mongoConnection
  let session

  beforeAll(async () => {
    mongoConnection = await connectToTestCluster()
    db = await mongoConnection.db('pulse-core')
  })

  beforeEach(async () => {
    await db.collection(mockTestCollectionName).insertMany(mockOrgTpsHistory)
    session = mongoConnection.startSession()
  })

  afterEach(async () => {
    await db.collection(mockTestCollectionName).deleteMany()
    session.endSession()
  })

  test('QualityAccessManager upsertion', async () => {
    const managerDao = new ManagerDao({ db })

    await session.withTransaction(async () => {
      await managerDao.upsertOrgTpHistory(
        qualityAccessMocks.mockPermittedOps,
        session,
        mockTestCollectionName
      )
    })

    const result = await db.collection(mockTestCollectionName).find().toArray()

    expect(result).toMatchObject(mockUpsertQualityOfAccessData)
  })

  test('AdditionalCriteriaManager upsertion', async () => {
    const managerDao = new ManagerDao({ db })

    await session.withTransaction(async () => {
      await managerDao.upsertOrgTpHistory(
        additionalCriteriaMocks.mockPermittedOps,
        session,
        mockTestCollectionName
      )
    })

    const result = await db.collection(mockTestCollectionName).find().toArray()

    expect(result).toMatchObject(mockUpsertAdditionalCriteriaData)
  })

  test('PolicyLinksManager upsertion', async () => {
    const managerDao = new ManagerDao({ db })
    await session.withTransaction(async () => {
      await managerDao.upsertOrgTpHistory(
        policyLinksMocks.mockPermittedOps,
        session,
        mockTestCollectionName
      )
    })

    const result = await db.collection(mockTestCollectionName).find().toArray()

    expect(result).toMatchObject(mockUpsertPolicyLinkData)
  })

  afterAll(async () => {
    await db.collection(mockTestCollectionName).drop()
    await mongoConnection.close()
  })
})
