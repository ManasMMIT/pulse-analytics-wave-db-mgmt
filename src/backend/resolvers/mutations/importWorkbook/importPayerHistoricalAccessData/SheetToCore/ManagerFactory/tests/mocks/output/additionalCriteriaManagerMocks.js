const mockPermittedOps = [
  {
    findObj: {
      orgTpId: "5eac293b79e11113da3b67f6",
      timestamp: new Date('2020-04-30T04:00:00.000+00:00')
    },
    setObj: {
      $set: {
        orgTpId: "5eac293b79e11113da3b67f6",
        treatmentPlanId: "5eac293a79e11113da3b1b6b",
        organizationId: "5d825030cc80b15a9476b813",
        projectId: "5eac2a7979e11113da445554",
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
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
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
  {
    findObj: {
      orgTpId: "5eac293b79e11113da3b683e",
      timestamp: new Date('2020-04-30T04:00:00.000+00:00')
    },
    setObj: {
      $set: {
        orgTpId: "5eac293b79e11113da3b683e",
        treatmentPlanId: "5eac293a79e11113da3b1b65",
        organizationId: "5d825030cc80b15a9476b822",
        projectId: "5eac2a7979e11113da445554",
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
        additionalCriteriaData: [
          {
            criteria: 'Baseline Hepatic Impairment/Liver Functioning',
            criteriaNotes: 'monotherapy',
            restrictionLevel: 'N/A'
          }
        ],
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
]


module.exports = {
  mockPermittedOps
}