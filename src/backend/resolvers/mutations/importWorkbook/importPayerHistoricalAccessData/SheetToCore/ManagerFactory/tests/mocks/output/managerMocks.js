const { ObjectId } = require('mongodb')

const mockFormattedTimestamp = new Date('2020-04-30T04:00:00.000+00:00')

const mockEnrichedPtpsByPtps = {
  "aetna|Breast Cancer|Herceptin|Adjuvant|HER2+|Commercial|Medical": [
    {
      _id: ObjectId("5eac293b79e11113da3b67f6"),
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "Adjuvant",
      book: "Commercial",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
      organizationId: ObjectId("5d825030cc80b15a9476b813")
    }
  ],
  "anthem|Breast Cancer|Herceptin+Perjeta+docetaxel|Neoadjuvant|HER2+|Medicare|Medical": [
    {
      _id: ObjectId("5eac293b79e11113da3b683e"),
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "Neoadjuvant",
      book: "Medicare",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
      organizationId: ObjectId("5d825030cc80b15a9476b822")
    }
  ],
  "bcbs-nc|Breast Cancer|Ibrance+Faslodex|2L+ Metastatic|HR+, HER2-|Commercial|Pharmacy": [
    {
      _id: ObjectId("5eac293b79e11113da3b687d"),
      slug: "bcbs-nc",
      indication: "Breast Cancer",
      regimen: "Ibrance+Faslodex",
      population: "HR+, HER2-",
      line: "2L+ Metastatic",
      book: "Commercial",
      coverage: "Pharmacy",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b83"),
      organizationId: ObjectId("5d825030cc80b15a9476b83d")
    }
  ],
  "aetna|Breast Cancer|Herceptin|1L+ Metastatic|HER2+|Commercial|Medical": [
    {
      _id: ObjectId("5eac293b79e11113da3b6800"),
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Commercial",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b73"),
      organizationId: ObjectId("5d825030cc80b15a9476b813")
    }
  ],
  "anthem|Breast Cancer|Herceptin+Perjeta+docetaxel|1L+ Metastatic|HER2+|Medicare|Medical": [
    {
      _id: ObjectId("5eac293b79e11113da3b6856"),
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Medicare",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b63"),
      organizationId: ObjectId("5d825030cc80b15a9476b822")
    }
  ]
}

const mockEnrichedPtpsByBrcs = {
  "aetna|Herceptin|Commercial|Medical": [
    {
      _id: ObjectId("5eac293b79e11113da3b67f6"),
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "Adjuvant",
      book: "Commercial",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
      organizationId: ObjectId("5d825030cc80b15a9476b813")
    },
    {
      _id: ObjectId("5eac293b79e11113da3b6800"),
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Commercial",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b73"),
      organizationId: ObjectId("5d825030cc80b15a9476b813")
    }
  ],
  "anthem|Herceptin+Perjeta+docetaxel|Medicare|Medical": [
    {
      _id: ObjectId("5eac293b79e11113da3b683e"),
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "Neoadjuvant",
      book: "Medicare",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
      organizationId: ObjectId("5d825030cc80b15a9476b822")
    },
    {
      _id: ObjectId("5eac293b79e11113da3b6856"),
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Medicare",
      coverage: "Medical",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b63"),
      organizationId: ObjectId("5d825030cc80b15a9476b822")
    }
  ],
  "bcbs-nc|Ibrance+Faslodex|Commercial|Pharmacy": [
    {
      _id: ObjectId("5eac293b79e11113da3b687d"),
      slug: "bcbs-nc",
      indication: "Breast Cancer",
      regimen: "Ibrance+Faslodex",
      population: "HR+, HER2-",
      line: "2L+ Metastatic",
      book: "Commercial",
      coverage: "Pharmacy",
      treatmentPlanId: ObjectId("5eac293a79e11113da3b1b83"),
      organizationId: ObjectId("5d825030cc80b15a9476b83d")
    }
  ]
}


const mockFilteredAndEnrichedData = [
  {
    slug: "aetna",
    indication: "Breast Cancer",
    regimen: "Herceptin",
    population: "HER2+",
    line: "Adjuvant",
    book: "Commercial",
    coverage: "Medical",
    mockDataField: "mockDataValue",
    orgTpId: ObjectId("5eac293b79e11113da3b67f6"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b6b"),
    organizationId: ObjectId("5d825030cc80b15a9476b813")
  },
  {
    slug: "anthem",
    indication: "Breast Cancer",
    regimen: "Herceptin+Perjeta+docetaxel",
    population: "HER2+",
    line: "Neoadjuvant",
    book: "Medicare",
    coverage: "Medical",
    mockDataField: "mockDataValue",
    orgTpId: ObjectId("5eac293b79e11113da3b683e"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b65"),
    organizationId: ObjectId("5d825030cc80b15a9476b822")
  },
  {
    slug: "bcbs-nc",
    indication: "Breast Cancer",
    regimen: "Ibrance+Faslodex",
    population: "HR+, HER2-",
    line: "2L+ Metastatic",
    book: "Commercial",
    coverage: "Pharmacy",
    mockDataField: "mockDataValue",
    orgTpId: ObjectId("5eac293b79e11113da3b687d"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b83"),
    organizationId: ObjectId("5d825030cc80b15a9476b83d")
  },
  {
    slug: "aetna",
    indication: "Breast Cancer",
    regimen: "Herceptin",
    population: "HER2+",
    line: "1L+ Metastatic",
    book: "Commercial",
    coverage: "Medical",
    mockDataField: "mockDataValue",
    orgTpId: ObjectId("5eac293b79e11113da3b6800"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b73"),
    organizationId: ObjectId("5d825030cc80b15a9476b813")
  },
  {
    slug: "anthem",
    indication: "Breast Cancer",
    regimen: "Herceptin+Perjeta+docetaxel",
    population: "HER2+",
    line: "1L+ Metastatic",
    book: "Medicare",
    coverage: "Medical",
    mockDataField: "mockDataValue",
    orgTpId: ObjectId("5eac293b79e11113da3b6856"),
    treatmentPlanId: ObjectId("5eac293a79e11113da3b1b63"),
    organizationId: ObjectId("5d825030cc80b15a9476b822")
  }
]

module.exports = {
  mockFormattedTimestamp,
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs,
  mockFilteredAndEnrichedData
}
