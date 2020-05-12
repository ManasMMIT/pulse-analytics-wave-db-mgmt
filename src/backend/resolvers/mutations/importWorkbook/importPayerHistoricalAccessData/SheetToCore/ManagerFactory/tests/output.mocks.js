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
  ]
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

const mockQualityOfAccessHash = {
  "PA to Label; Default to Guidelines": {
    _id: "5d7f8d1280bba90668ddcb12",
    score: 4,
    sortOrder: 6,
    createdOn: "2019-09-16T13:24:34.389Z",
    access: "PA to Label; Default to Guidelines",
    accessTiny: "Default to Guidelines",
    color: "#1DB7D2",
    caption: {
      General:
        "Prior authorization is required and defaults to guidelines, which mirrors the approved indication"
    }
  },
  "PA to NCCN": {
    _id: "5d7f8d1280bba90668ddcb13",
    score: 4,
    sortOrder: 5,
    createdOn: "2019-09-16T13:24:34.389Z",
    access: "PA to NCCN",
    accessTiny: "PA to NCCN",
    color: "#1DB7D2",
    caption: {
      General:
        "Prior authorization is required, and the regimen has equal access to NCCN guidelines as stated in payer policy"
    }
  },
  "PA to Label; Additional Criteria": {
    _id: "5d7f8d1280bba90668ddcb16",
    score: 10,
    sortOrder: 10,
    createdOn: "2019-09-16T13:24:34.389Z",
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
  mockOrgsHashBySlug,
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs,
  mockQualityOfAccessHash
}
