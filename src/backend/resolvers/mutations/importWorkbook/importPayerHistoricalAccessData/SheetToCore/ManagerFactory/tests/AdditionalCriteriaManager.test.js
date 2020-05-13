const AdditionalCriteriaManager = require('../AdditionalCriteriaManager')
const {
  mockTimestamp,
  mockEnrichedPtps,
  mockProjectId,
} = require('./mocks/input/managerMocks')

const {
  mockAdditionalCriteriaSheetData
} = require('./mocks/input/additionalCriteriaManagerMocks')

const {
  mockPermittedOps
} = require('./mocks/output/additionalCriteriaManagerMocks')

const { setupDateStub } = require('./test-utils')

describe('Additional Criteria Manager', () => {
  let realDate

  beforeAll(() => {
    realDate = Date
    setupDateStub()
  })

  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const additionalCriteriaManager = new AdditionalCriteriaManager({
      sheetData: mockAdditionalCriteriaSheetData,
      timestamp: mockTimestamp,
      projectId: mockProjectId
    })

    additionalCriteriaManager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    const permittedOps = additionalCriteriaManager.getPermittedOps()

    expect(permittedOps).toMatchObject(mockPermittedOps)
  })

  afterAll(() => {
    global.Date = realDate
  })
})
