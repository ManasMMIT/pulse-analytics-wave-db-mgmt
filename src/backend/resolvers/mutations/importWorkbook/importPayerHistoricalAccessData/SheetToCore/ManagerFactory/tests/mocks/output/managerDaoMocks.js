const { ObjectId } = require('mongodb')

const mockUpsertQualityOfAccessData = [
  {
    _id: ObjectId("5eac293b79e11113da3b67f1"),
    orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    accessData: {
      _id: ObjectId("5d7f8d1280bba90668ddcb12"),
      score: 4,
      sortOrder: 6,
      access: "PA to Label; Default to Guidelines",
      accessTiny: "Default to Guidelines",
      color: "#1DB7D2",
      caption: {
        General:
        "Prior authorization is required and defaults to guidelines, which mirrors the approved indication"
      }
    },
    tierData: {
      tier: "MB",
      tierRating: "Medical Benefit",
      tierTotal: null
    },
    additionalCriteriaData: [],
    policyLinkData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f2"),
    orgTpId: ObjectId("5eac293b79e11113da3b683e"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
    accessData: {
      _id: ObjectId("5d7f8d1280bba90668ddcb13"),
      score: 4,
      sortOrder: 5,
      access: "PA to NCCN",
      accessTiny: "PA to NCCN",
      color: "#1DB7D2",
      caption: {
        General:
          "Prior authorization is required, and the regimen has equal access to NCCN guidelines as stated in payer policy"
      }
    },
    tierData: {
      tier: "MB",
      tierRating: "Medical Benefit",
      tierTotal: null
    },
    additionalCriteriaData: [],
    policyLinkData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f3"),
    orgTpId: ObjectId("5eac293b79e11113da3b6800"),
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

const mockUpsertAdditionalCriteriaData = [
  {
    _id: ObjectId("5eac293b79e11113da3b67f1"),
    orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    additionalCriteriaData: [
      {
        criteria: 'Treatment History',
        criteriaNotes: null,
        restrictionLevel: null
      },
      {
        criteria: 'Lab Test and Value Requirements',
        criteriaNotes: null,
        restrictionLevel: null
      },
    ],
    accessData: {},
    policyLinkData: {},
    tierData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f2"),
    orgTpId: ObjectId("5eac293b79e11113da3b683e"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
    additionalCriteriaData: [
      {
        criteria: 'Baseline Hepatic Impairment/Liver Functioning',
        criteriaNotes: 'monotherapy',
        restrictionLevel: 'N/A'
      }
    ],
    accessData: {},
    policyLinkData: {},
    tierData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f3"),
    orgTpId: ObjectId("5eac293b79e11113da3b6800"),
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

const mockUpsertPolicyLinkData = [
  {
    _id: ObjectId("5eac293b79e11113da3b67f1"),
    orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    policyLinkData: {
      policyLink: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Aetna+Comm.pdf',
      dateTracked: '1/1/2020',
      paLink: 'N/A',
      siteLink: null,
    },
    accessData: {},
    additionalCriteriaData: [],
    tierData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f2"),
    orgTpId: ObjectId("5eac293b79e11113da3b683e"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
    policyLinkData: {
      policyLink: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Anthem+Medicare.pdf',
      dateTracked: '2/1/2020',
      paLink: 'N/A',
      siteLink: null,
    },
    accessData: {},
    additionalCriteriaData: [],
    tierData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f3"),
    orgTpId: ObjectId("5eac293b79e11113da3b6800"),
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b73"),
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
    policyLinkData: {
      policyLink: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Aetna+Comm.pdf',
      dateTracked: '1/1/2020',
      paLink: 'N/A',
      siteLink: null,
    },
    accessData: {},
    additionalCriteriaData: [],
    tierData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  },
  {
    _id: ObjectId("5eac293b79e11113da3b67f4"),
    orgTpId: ObjectId("5eac293b79e11113da3b6856"), 
    timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b63"),
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
    policyLinkData: {
      policyLink: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Anthem+Medicare.pdf',
      dateTracked: '2/1/2020',
      paLink: 'N/A',
      siteLink: null,
    },
    accessData: {},
    additionalCriteriaData: [],
    tierData: {},
    updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
    createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
  }
]

module.exports = {
  mockUpsertQualityOfAccessData,
  mockUpsertAdditionalCriteriaData,
  mockUpsertPolicyLinkData
}
