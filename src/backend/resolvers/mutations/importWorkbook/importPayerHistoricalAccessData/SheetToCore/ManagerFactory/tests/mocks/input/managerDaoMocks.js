const { ObjectId } = require('mongodb')

const mockTestCollectionName = 'test.organizations.treatmentPlans.history'

const mockOrgTpsHistory = [
  {
    _id: ObjectId("5eac293b79e11113da3b67f1"),
    orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
    projectId: ObjectId("5eac2a7979e11113da445554"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
    accessData: {},
    additionalCriteriaData: [],
    policyLinkData: {},
    tierData: {},
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f2"),
    orgTpId: ObjectId("5eac293b79e11113da3b683e"),
    projectId: ObjectId("5eac2a7979e11113da445554"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
    accessData: {},
    additionalCriteriaData: [],
    policyLinkData: {},
    tierData: {},
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f3"),
    orgTpId: ObjectId("5eac293b79e11113da3b6800"),
    projectId: ObjectId("5eac2a7979e11113da445554"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b73"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
    accessData: {},
    additionalCriteriaData: [],
    policyLinkData: {},
    tierData: {},
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f4"),
    orgTpId: ObjectId("5eac293b79e11113da3b6856"),
    projectId: ObjectId("5eac2a7979e11113da445554"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b63"),
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
    accessData: {},
    additionalCriteriaData: [],
    policyLinkData: {},
    tierData: {},
  }
]

module.exports = {
  mockTestCollectionName,
  mockOrgTpsHistory
}
