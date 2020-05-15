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
        projectId: ObjectId("5eac2a7979e11113da445554"),
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
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
        projectId: ObjectId("5eac2a7979e11113da445554"),
        timestamp: new Date('2020-04-30T04:00:00.000+00:00'),
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
        updatedOn: new Date('2020-04-30T04:00:00.000+00:00'),
      },
      $setOnInsert: {
        createdOn: new Date('2020-04-30T04:00:00.000+00:00'),
      }
    }
  },
]

const mockQualityOfAccessHash = {
  "PA to Label; Default to Guidelines": {
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
  "PA to NCCN": {
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
  "PA to Label; Additional Criteria": {
    _id: ObjectId("5d7f8d1280bba90668ddcb16"),
    score: 10,
    sortOrder: 10,
    access: "PA to Label; Additional Criteria",
    accessTiny: "PA to Label; Add'l Criteria",
    color: "#79D9EA",
    caption: {
      ALL:
        'Prior authorization is required, and additional criteria beyond FDA label have to be met in order to receive coverage (e.g. "inpatient use," TKI failures, additional age criteria 2-25, ECOG Performance, Absence of Infection)',
      AML:
        "Prior authorization is required, and additional criteria beyond FDA label that are perceived as significantly burdensome are required (e.g. no coverage of Rydapt in maintenance settings or required submission of testing documentation for Idhifa, etc.)",
      DLBCL:
        "Prior authorization is required, and additional criteria beyond FDA label have to be met in order to get coverage approval (e.g. neutrophil count, platelet count, no deterioration in organ function expected in 4 weeks)",
      General:
        "Prior authorization is required, and additional criteria beyond FDA label have to be met in order to get coverage approval (e.g. oncologist Rx, medical documentations)"
    }
  }
}


module.exports = {
  mockPermittedOps,
  mockQualityOfAccessHash
}
