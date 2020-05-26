const { ObjectId } = require('mongodb')

const mockTimestamp = "2020-04-30"

const mockProjectId = ObjectId('5eac2a7979e11113da445554')

const mockSheetData = [
  {
    slug: "aetna",
    indication: "Breast Cancer",
    regimen: "Herceptin",
    population: "HER2+",
    line: "Adjuvant",
    book: "Commercial",
    coverage: "Medical",
    mockDataField: "mockDataValue"
  },
  {
    slug: "anthem",
    indication: "Breast Cancer",
    regimen: "Herceptin+Perjeta+docetaxel",
    population: "HER2+",
    line: "Neoadjuvant",
    book: "Medicare",
    coverage: "Medical",
    mockDataField: "mockDataValue"
  },
  {
    slug: "bcbs-nc",
    indication: "Breast Cancer",
    regimen: "Ibrance+Faslodex",
    population: "HR+, HER2-",
    line: "2L+ Metastatic",
    book: "Commercial",
    coverage: "Pharmacy",
    mockDataField: "mockDataValue"
  },
  {
    slug: "aetna",
    indication: "Breast Cancer",
    regimen: "Herceptin",
    population: "HER2+",
    line: "1L+ Metastatic",
    book: "Commercial",
    coverage: "Medical",
    mockDataField: "mockDataValue"
  },
  {
    slug: "anthem",
    indication: "Breast Cancer",
    regimen: "Herceptin+Perjeta+docetaxel",
    population: "HER2+",
    line: "1L+ Metastatic",
    book: "Medicare",
    coverage: "Medical",
    mockDataField: "mockDataValue"
  }
]

const mockEnrichedPtps = [
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
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
  },
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
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
  },
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
    organizationId: ObjectId("5d825030cc80b15a9476b83d"),
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
    organizationId: ObjectId("5d825030cc80b15a9476b813"),
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
    organizationId: ObjectId("5d825030cc80b15a9476b822"),
  }
]

module.exports = {
  mockTimestamp,
  mockProjectId,
  mockEnrichedPtps,
  mockSheetData,
}
