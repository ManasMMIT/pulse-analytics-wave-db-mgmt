const QualityOfAccessManager = require('../QualityAccessManager')
const {
  mockTimestamp,
  mockOrganizations,
  mockEnrichedPtps,
  mockAccesses,
  mockProjectId,
} = require('./mocks/input/managerMocks')
const {
  mockQualityOfAccessSheetData
} = require('./mocks/input/qualityOfAccessManagerMocks')

const {
  mockPermittedOps
} = require('./mocks/output/qualityOfAccessManagerMocks')

const { setupDateStub } = require('./test-utils')

describe('Quality of Access Manager', () => {
  let realDate

  beforeAll(() => {
    realDate = Date
    setupDateStub()
  })

  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const qoaManager = new QualityOfAccessManager({
      sheetData: mockQualityOfAccessSheetData,
      timestamp: mockTimestamp,
      projectId: mockProjectId
    })

    qoaManager.setupHashes({
      setOrgs: mockOrganizations,
      setEnrichedPtps: mockEnrichedPtps,
      setQualityOfAccesses: mockAccesses
    })

    const permittedOps = qoaManager.getPermittedOps()

    expect(permittedOps).toMatchObject(mockPermittedOps)
  })

  afterAll(() => {
    global.Date = realDate
  })
})