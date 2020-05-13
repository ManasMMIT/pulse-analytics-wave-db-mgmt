const { ObjectId } = require('mongodb')

const mockPermittedOps = [
  {
    findObj: {
      orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
      timestamp: new Date('2020-04-30T04:00:00.000+00:00')
    },
    setObj: {
      $set: {
        orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
        treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
        organizationId: ObjectId("5d825030cc80b15a9476b813"),
        projectId: "5eac2a7979e11113da445554",
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
        policyLinkData: {
          link: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Aetna+Comm.pdf',
          dateTracked: '1/1/2020',
          paLink: 'N/A',
          policyLink: null,
          siteLink: null,
        },
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
  {
    findObj: {
      orgTpId: ObjectId("5eac293b79e11113da3b6800"),
      timestamp: new Date('2020-04-30T04:00:00.000+00:00')
    },
    setObj: {
      $set: {
        orgTpId: ObjectId("5eac293b79e11113da3b6800"),
        treatmentPlanId: ObjectId("5eac293a79e11113da3b1b73"),
        organizationId: ObjectId("5d825030cc80b15a9476b813"),
        projectId: "5eac2a7979e11113da445554",
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
        policyLinkData: {
          link: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Aetna+Comm.pdf',
          dateTracked: '1/1/2020',
          paLink: 'N/A',
          policyLink: null,
          siteLink: null,
        },
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
  {
    findObj: {
      orgTpId: ObjectId("5eac293b79e11113da3b683e"),
      timestamp: new Date('2020-04-30T04:00:00.000+00:00')
    },
    setObj: {
      $set: {
        orgTpId: ObjectId("5eac293b79e11113da3b683e"),
        treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
        organizationId: ObjectId("5d825030cc80b15a9476b822"),
        projectId: "5eac2a7979e11113da445554",
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
        policyLinkData: {
          link: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Anthem+Medicare.pdf',
          dateTracked: '2/1/2020',
          paLink: 'N/A',
          policyLink: null,
          siteLink: null,
        },
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
  {
    findObj: {
      orgTpId: ObjectId("5eac293b79e11113da3b6856"),
      timestamp: new Date('2020-04-30T04:00:00.000+00:00')
    },
    setObj: {
      $set: {
        orgTpId: ObjectId("5eac293b79e11113da3b6856"),
        treatmentPlanId: ObjectId("5eac293a79e11113da3b1b63"),
        organizationId: ObjectId("5d825030cc80b15a9476b822"),
        projectId: "5eac2a7979e11113da445554",
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
        policyLinkData: {
          link: 'https://s3-us-west-2.amazonaws.com/tdgwebportal/Anti-Emetic+Policy+Tracking/2017+Q3+Updates/Aetna/Commercial/Anthem+Medicare.pdf',
          dateTracked: '2/1/2020',
          paLink: 'N/A',
          policyLink: null,
          siteLink: null,
        },
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  }
]


module.exports = {
  mockPermittedOps
}
