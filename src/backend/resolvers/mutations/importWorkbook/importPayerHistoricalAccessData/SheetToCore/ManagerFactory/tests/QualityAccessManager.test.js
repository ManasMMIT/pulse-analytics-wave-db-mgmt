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

let realDate
describe('Quality of Access Manager', () => {
  beforeAll(() => {
    realDate = Date
    global.Date = class extends Date {
      // override constructor to stub date object that is being called inside the Manager class
      constructor(...args) {
        if (args.length > 0) {
          return super(...args);
        }
  
        return new Date('2020-04-30T04:00:00.000+00:00')
      }
    }
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