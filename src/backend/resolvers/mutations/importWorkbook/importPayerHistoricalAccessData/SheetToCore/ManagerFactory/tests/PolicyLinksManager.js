const PolicyLinksManager = require('../PolicyLinksManager')
const {
  mockTimestamp,
  mockEnrichedPtps,
  mockProjectId,
} = require('./mocks/input/managerMocks')

const {
  mockPolicyLinkData
} = require('./mocks/input/policyLinksManagerMocks')

const {
  mockPermittedOps
} = require('./mocks/output/policyLinksManagerMocks')

const { setupDateStub } = require('./test-utils')

describe('Policy Links Manager', () => {
  let realDate

  beforeAll(() => {
    realDate = Date
    setupDateStub()
  })

  test('getPermittedOps should return a list of valid operations for upsertion', () => {
    const policyLinksManager = new PolicyLinksManager({
      sheetData: mockPolicyLinkData,
      timestamp: mockTimestamp,
      projectId: mockProjectId
    })

    policyLinksManager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    const permittedOps = policyLinksManager.getPermittedOps()

    expect(permittedOps).toMatchObject(mockPermittedOps)
  })

  afterAll(() => {
    global.Date = realDate
  })
})