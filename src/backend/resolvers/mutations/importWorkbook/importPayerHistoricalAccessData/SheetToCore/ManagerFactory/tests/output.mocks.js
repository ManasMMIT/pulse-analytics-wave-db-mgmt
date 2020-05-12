const mockOrgsHashBySlug = {
  aetna: {
    _id: "5d825030cc80b15a9476b813",
    slug: "aetna",
    type: "Payer",
    organization: "Aetna",
    organizationTiny: "Aetna",
    toolIds: [
      "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
      "b81f2c08-dfb7-474c-b8db-6b4f1cdac43c"
    ]
  },
  anthem: {
    _id: "5d825030cc80b15a9476b822",
    slug: "anthem",
    type: "Payer",
    organization: "Anthem",
    organizationTiny: "Anthem",
    toolIds: [
      "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
      "b81f2c08-dfb7-474c-b8db-6b4f1cdac43c"
    ]
  },
  "bcbs-nc": {
    _id: "5d825030cc80b15a9476b83d",
    slug: "bcbs-nc",
    type: "Payer",
    organization: "BlueCross BlueShield North Carolina",
    organizationTiny: "BCBS NC",
    toolIds: [
      "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
      "b81f2c08-dfb7-474c-b8db-6b4f1cdac43c"
    ]
  }
}

const mockEnrichedPtpsByPtps = {
  "aetna|Breast Cancer|Herceptin|Adjuvant|HER2+|Commercial|Medical": [
    {
      _id: "5eac293b79e11113da3b67f6",
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "Adjuvant",
      book: "Commercial",
      coverage: "Medical"
    }
  ],
  "anthem|Breast Cancer|Herceptin+Perjeta+docetaxel|Neoadjuvant|HER2+|Medicare|Medical": [
    {
      _id: "5eac293b79e11113da3b683e",
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "Neoadjuvant",
      book: "Medicare",
      coverage: "Medical"
    }
  ],
  "bcbs-nc|Breast Cancer|Ibrance+Faslodex|2L+ Metastatic|HR+, HER2-|Commercial|Pharmacy": [
    {
      _id: "5eac293b79e11113da3b687d",
      slug: "bcbs-nc",
      indication: "Breast Cancer",
      regimen: "Ibrance+Faslodex",
      population: "HR+, HER2-",
      line: "2L+ Metastatic",
      book: "Commercial",
      coverage: "Pharmacy"
    }
  ],
  "aetna|Breast Cancer|Herceptin|1L+ Metastatic|HER2+|Commercial|Medical": [
    {
      _id: "5eac293b79e11113da3b6800",
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Commercial",
      coverage: "Medical"
    }
  ],
  "anthem|Breast Cancer|Herceptin+Perjeta+docetaxel|1L+ Metastatic|HER2+|Medicare|Medical": [
    {
      _id: "5eac293b79e11113da3b6856",
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Medicare",
      coverage: "Medical"
    }
  ],
}

const mockEnrichedPtpsByBrcs = {
  "aetna|Herceptin|Commercial|Medical": [
    {
      _id: "5eac293b79e11113da3b67f6",
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "Adjuvant",
      book: "Commercial",
      coverage: "Medical"
    },
    {
      _id: "5eac293b79e11113da3b6800",
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Commercial",
      coverage: "Medical"
    }
  ],
  "anthem|Herceptin+Perjeta+docetaxel|Medicare|Medical": [
    {
      _id: "5eac293b79e11113da3b683e",
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "Neoadjuvant",
      book: "Medicare",
      coverage: "Medical"
    },
    {
      _id: "5eac293b79e11113da3b6856",
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Medicare",
      coverage: "Medical"
    }
  ],
  "bcbs-nc|Ibrance+Faslodex|Commercial|Pharmacy": [
    {
      _id: "5eac293b79e11113da3b687d",
      slug: "bcbs-nc",
      indication: "Breast Cancer",
      regimen: "Ibrance+Faslodex",
      population: "HR+, HER2-",
      line: "2L+ Metastatic",
      book: "Commercial",
      coverage: "Pharmacy"
    }
  ]
}

module.exports = {
  mockOrgsHashBySlug,
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs
}
