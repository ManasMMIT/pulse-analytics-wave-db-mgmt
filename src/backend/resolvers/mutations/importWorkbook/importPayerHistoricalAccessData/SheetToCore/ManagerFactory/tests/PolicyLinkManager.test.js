const PolicyLinkManager = require('../PolicyLinkManager')
const {
  mockTimestamp,
  mockEnrichedPtps,
  mockProjectId,
} = require('./mocks/input/managerMocks')

const {
  mockPolicyLinkSheetData
} = require('./mocks/input/policyLinkManagerMocks')

const {
  mockPermittedOps
} = require('./mocks/output/policyLinkManagerMocks')

const { setupDateStub } = require('./test-utils')

describe('Policy Links Manager', () => {
  let realDate

  beforeAll(() => {
    realDate = Date
    setupDateStub()
  })

  test('getPermittedOps should return a list of valid operations for upsertion for all PTPS that has the BRCS combo', () => {
    const policyLinksManager = new PolicyLinkManager({
      sheetData: mockPolicyLinkSheetData,
      timestamp: mockTimestamp,
      projectId: mockProjectId,
      hashType: 'brcs'
    })

    policyLinksManager.setEnrichedPtpsByCombination(mockEnrichedPtps)
    const permittedOps = policyLinksManager.getPermittedOps()

    expect(permittedOps).toMatchObject(mockPermittedOps)
  })

  afterAll(() => {
    global.Date = realDate
  })
})