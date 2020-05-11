const { ObjectId } = require("mongodb");
const mockQOAData = [
  {
    slug: "aetna",
    organization: "Aetna",
    indication: "NSCLC",
    population: "No Subtype Specified",
    line: "Stage III",
    regimen: "Imfinzi",
    access: "PA to Label; Additional Criteria",
    tier: "MB",
    tierRating: "Medical Benefit",
    coverage: "Medical",
    book: "Commercial"
  }
];

const mockAdditionalCriteriaData = [
  {
    slug: "aetna",
    organization: "Aetna",
    indication: "NSCLC",
    population: "No Subtype Specified",
    line: "Stage III",
    coverage: "Medical",
    book: "Commercial",
    regimen: "Imfinzi",
    criteria: "ECOG Requirement",
    restrictionLevel: null
  },
  {
    slug: "aetna",
    organization: "Aetna",
    indication: "NSCLC",
    population: "No Subtype Specified",
    line: "Stage III",
    coverage: "Medical",
    book: "Commercial",
    regimen: "Imfinzi",
    criteria: "ECOG Requirement 2",
    restrictionLevel: null
  }
];

const mockPolicyLinkData = [
  {
    slug: "aetna",
    organization: "Aetna",
    coverage: "Medical",
    book: "Commercial",
    regimen: "Imfinzi",
    link:
      "https://tdgwebportal.s3-us-west-2.amazonaws.com/Merck+Keytruda+QoA+Tracking+2019/Q3+2019/8-2019/Q3+2019+Aetna+Commercial+Imfinzi.pdf"
  }
];

const mockTimestamp = "2020-04-30";

const mockProjectId = "5e907cb3b4e5d9e58d481098";

const mockOrgTps = [
  {
    _id: ObjectId("5eac79433957c339fddf800c"),
    orgTpId: ObjectId("5eac293b79e11113da3b3fae"),
    timestamp: new Date("2020-04-30T04:00:00Z"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    projectId: ObjectId("5e907cb3b4e5d9e58d481098"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1aa1"),
    createdOn: new Date("2020-05-01T19:32:39.826Z"),
  },
  {
    _id: ObjectId("5eac79573957c339fddf8155"),
    orgTpId: ObjectId("5eac293b79e11113da3b3fdc"),
    timestamp: new Date("2020-04-30T04:00:00Z"),
    createdOn: new Date("2020-05-01T19:32:39.826Z"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    projectId: ObjectId("5e907cb3b4e5d9e58d481098"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1aa4"),
    updatedOn: new Date("2020-05-01T19:32:39.826Z") 
  }
]

const OTP_ID_1 = ObjectId('5eac293b79e11113da3b3fae')
const OTP_ID_2 = ObjectId('5eac293b79e11113da3b3fdc')
const TEST_COLLECTION_NAME = 'test.organizations.treatmentPlans.history'

module.exports = {
  mockQOAData,
  mockAdditionalCriteriaData,
  mockPolicyLinkData,
  mockTimestamp,
  mockProjectId,
  mockOrgTps,
  OTP_ID_1,
  OTP_ID_2,
  TEST_COLLECTION_NAME,
}
