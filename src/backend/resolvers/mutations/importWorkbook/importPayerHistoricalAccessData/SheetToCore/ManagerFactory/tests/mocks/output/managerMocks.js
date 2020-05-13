const mockFormattedTimestamp = new Date('2020-04-30T04:00:00.000+00:00')

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
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b6b",
      organizationId: "5d825030cc80b15a9476b813"
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
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b65",
      organizationId: "5d825030cc80b15a9476b822"
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
      coverage: "Pharmacy",
      treatmentPlanId: "5eac293a79e11113da3b1b83",
      organizationId: "5d825030cc80b15a9476b83d"
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
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b73",
      organizationId: "5d825030cc80b15a9476b813"
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
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b63",
      organizationId: "5d825030cc80b15a9476b822"
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
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b6b",
      organizationId: "5d825030cc80b15a9476b813"
    },
    {
      _id: "5eac293b79e11113da3b6800",
      slug: "aetna",
      indication: "Breast Cancer",
      regimen: "Herceptin",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Commercial",
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b73",
      organizationId: "5d825030cc80b15a9476b813"
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
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b65",
      organizationId: "5d825030cc80b15a9476b822"
    },
    {
      _id: "5eac293b79e11113da3b6856",
      slug: "anthem",
      indication: "Breast Cancer",
      regimen: "Herceptin+Perjeta+docetaxel",
      population: "HER2+",
      line: "1L+ Metastatic",
      book: "Medicare",
      coverage: "Medical",
      treatmentPlanId: "5eac293a79e11113da3b1b63",
      organizationId: "5d825030cc80b15a9476b822"
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
      coverage: "Pharmacy",
      treatmentPlanId: "5eac293a79e11113da3b1b83",
      organizationId: "5d825030cc80b15a9476b83d"
    }
  ]
}

const mockQualityOfAccessHash = {
  "PA to Label; Default to Guidelines": {
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
  "PA to NCCN": {
    _id: "5d7f8d1280bba90668ddcb13",
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
    _id: "5d7f8d1280bba90668ddcb16",
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
    orgTpId: "5eac293b79e11113da3b67f6",
    treatmentPlanId: "5eac293a79e11113da3b1b6b",
    organizationId: "5d825030cc80b15a9476b813"
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
    orgTpId: "5eac293b79e11113da3b683e",
    treatmentPlanId: "5eac293a79e11113da3b1b65",
    organizationId: "5d825030cc80b15a9476b822"
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
    orgTpId: "5eac293b79e11113da3b687d",
    treatmentPlanId: "5eac293a79e11113da3b1b83",
    organizationId: "5d825030cc80b15a9476b83d"
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
    orgTpId: "5eac293b79e11113da3b6800",
    treatmentPlanId: "5eac293a79e11113da3b1b73",
    organizationId: "5d825030cc80b15a9476b813"
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
    orgTpId: "5eac293b79e11113da3b6856",
    treatmentPlanId: "5eac293a79e11113da3b1b63",
    organizationId: "5d825030cc80b15a9476b822"
  }
]

module.exports = {
  mockFormattedTimestamp,
  mockEnrichedPtpsByPtps,
  mockEnrichedPtpsByBrcs,
  mockQualityOfAccessHash,
  mockFilteredAndEnrichedData
}
