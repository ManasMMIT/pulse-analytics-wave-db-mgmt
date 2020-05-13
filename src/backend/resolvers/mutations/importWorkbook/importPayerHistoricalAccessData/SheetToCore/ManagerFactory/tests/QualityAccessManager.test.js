const QualityOfAccessManager = require('../QualityAccessManager')
const {
  mockTimestamp,
  mockEnrichedPtps,
  mockAccesses,
  mockProjectId,
} = require('./mocks/input/managerMocks')
const {
  mockQualityOfAccessSheetData,
  mockQualityOfAccessHash
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

  test('setQualityOfAccessHash should set an array of quality of access data grouped by access', () => {
    const qoaManager = new QualityOfAccessManager({})
    qoaManager.setQualityOfAccessHash(mockAccesses)
    expect(qoaManager.qualityOfAccessHash).toStrictEqual(mockQualityOfAccessHash)
  })

  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const qoaManager = new QualityOfAccessManager({
      sheetData: mockQualityOfAccessSheetData,
      timestamp: mockTimestamp,
      projectId: mockProjectId
    })

    qoaManager.setQualityOfAccessHash(mockAccesses)
    qoaManager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    const permittedOps = qoaManager.getPermittedOps()

    expect(permittedOps).toMatchObject(mockPermittedOps)
  })

  afterAll(() => {
    global.Date = realDate
  })
})