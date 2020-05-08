const mockPtps = {
  "bcbs-mn|ALL|Kymriah|2L+|No Subtype Specified|Commercial|Medical": {
    "_id": "5eac293b79e11113da3b1bd2",
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  },
  "fepb|ALL|Besponsa|2L|No Subtype Specified|Commercial|Medical": {
    "_id": "5eac293b79e11113da3b1c08",
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical"
  },
  "horizon-bcbs-nj|ALL|Kymriah|2L+|No Subtype Specified|Commercial|Medical": {
    "_id": "5eac293b79e11113da3b1bea",
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
  }
}

const mockBrcs = {
  "bcbs-mn|Kymriah|Commercial|Medical": {
    "_id": "5eac293b79e11113da3b1bd2",
    "slug": "bcbs-mn",
    "regimen": "Kymriah",
    "book": "Commercial",
    "coverage": "Medical"
  },
  "fepb|Besponsa|Commercial|Medical": {
    "_id": "5eac293b79e11113da3b1c08",
    "slug": "fepb",
    "regimen": "Besponsa",
    "book": "Commercial",
    "coverage": "Medical"
  },
  "aetna|Keytruda|Medicare|Medical": {
    "_id": "5eac293b79e11113da3b1c10",
    "slug": "aetna",
    "regimen": "Keytruda",
    "book": "Medicare",
    "coverage": "Medical"
  }
}

// QOA DATA
const mockValidQoaData = [
  {
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  },
  {
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  },
  {
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  }
]

const mockInvalidQoaData = [
  {
    "slug": "bcbs-la",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  },
  {
    "slug": "hmsa",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  },
  {
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  }
]

const mockInvalidQoaData2 = [
  {
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  }
]

const mockDuplicateInvalidQoaData = [
  {
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access A"
  },
  {
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access B"
  },
  {
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access C"
  },
  {
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "access": "access D"
  }
]

// Additional Criteria Data
const mockValidCriteriaData = [
  {
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "criteria": "criteria A"
  },
  {
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "criteria": "criteria B"
  },
  {
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "criteria": "criteria C"
  }
]

const mockInvalidCriteriaData = [
  {
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "criteria": "criteria A"
  },
  {
    "slug": "hmsa",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "criteria": "criteria B"
  },
  {
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical",
    "criteria": "criteria C"
  }
]

const mockValidPolicyLinkData = [
  {
    "slug": "bcbs-mn",
    "regimen": "Kymriah",
    "book": "Commercial",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-a.pdf"
  },
  {
    "slug": "fepb",
    "regimen": "Besponsa",
    "book": "Commercial",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-b.pdf"
  },
  {
    "slug": "aetna",
    "regimen": "Keytruda",
    "book": "Medicare",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-c.pdf"
  },
]

const mockValidPolicyLinkData2 = [
  {
    "slug": "aetna",
    "regimen": "Keytruda",
    "book": "Medicare",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-c.pdf"
  },
]

const mockInvalidPolicyLinkData = [
  {
    "slug": "bcbs-sc",
    "regimen": "Imfinzi",
    "book": "Commercial",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-a.pdf"
  },
  {
    "slug": "fepb",
    "regimen": "Besponsa",
    "book": "Commercial",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-b.pdf"
  },
  {
    "slug": "aetna",
    "regimen": "Keytruda",
    "book": "Medicare",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-c.pdf"
  },
]

const mockDuplicateInvalidPolicyLinkData = [
  {
    "slug": "fepb",
    "regimen": "Besponsa",
    "book": "Commercial",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-a.pdf"
  },
  {
    "slug": "fepb",
    "regimen": "Besponsa",
    "book": "Commercial",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-b.pdf"
  },
  {
    "slug": "aetna",
    "regimen": "Keytruda",
    "book": "Medicare",
    "coverage": "Medical",
    "link": "https://s3-us-west-2.amazonaws.com/tdgwebportal/link-c.pdf"
  },
]

module.exports = {
  mockPtps,
  mockBrcs,
  mockInvalidQoaData,
  mockInvalidQoaData2,
  mockValidQoaData,
  mockDuplicateInvalidQoaData,
  mockValidCriteriaData,
  mockInvalidCriteriaData,
  mockValidPolicyLinkData,
  mockValidPolicyLinkData2,
  mockInvalidPolicyLinkData,
  mockDuplicateInvalidPolicyLinkData
}