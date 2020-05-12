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
        accessData: {
          _id: "5d7f8d1280bba90668ddcb12",
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
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
  // {
  //   findObj: {
  //     orgTpId: "5eac293b79e11113da3b67f6",
  //     timestamp: new Date('2020-04-30T04:00:00.000+00:00')
  //   },
  //   setObj: {
  //     orgTpId,
  //     treatmentPlanId,
  //     organizationId,
  //     projectId: this.projectId,
  //     timestamp: this.timestamp,
  //     accessData,
  //     tierData: {
  //       tier,
  //       tierRating,
  //       tierTotal,
  //     },
  //     updatedOn,
  //   },
  //   $setOnInsert: {
  //     createdOn: updatedOn,
  //   }
  // }
]


module.exports = {
  mockPermittedOps
}