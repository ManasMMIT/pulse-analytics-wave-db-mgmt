const { ObjectId } = require('mongodb')

const mockQualityOfAccessSheetData = [
  {
    slug: "aetna",
    indication: "Breast Cancer",
    regimen: "Herceptin",
    population: "HER2+",
    line: "Adjuvant",
    book: "Commercial",
    coverage: "Medical",
    access: "PA to Label; Default to Guidelines",
    tier: "MB",
    tierRating: "Medical Benefit",
    tierTotal: null
  },
  {
    slug: "anthem",
    indication: "Breast Cancer",
    regimen: "Herceptin+Perjeta+docetaxel",
    population: "HER2+",
    line: "Neoadjuvant",
    book: "Medicare",
    coverage: "Medical",
    access: "PA to NCCN",
    tier: "MB",
    tierRating: "Medical Benefit",
    tierTotal: null
  },
]

const mockAccesses = [
  {
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
  {
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
  {
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
]

module.exports = {
  mockQualityOfAccessSheetData,
  mockAccesses
}
