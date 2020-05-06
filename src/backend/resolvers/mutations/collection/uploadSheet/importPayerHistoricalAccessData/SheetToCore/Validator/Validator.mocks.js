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
    "coverage": "Medical"
  }
}

const mockValidSheetData = [
  {
    "_id": "5eac293b79e11113da3b1bd2",
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1c08",
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1bea",
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  }
]

const mockInvalidData = [
  {
    "_id": "5eac293b79e11113da3b1c09",
    "slug": "bcbs-la",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1c0a",
    "slug": "hmsa",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1bea",
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  }
]

const mockDuplicateInvalidData = [
  {
    "_id": "5eac293b79e11113da3b1c08",
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1bd2",
    "slug": "bcbs-mn",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1c08",
    "slug": "fepb",
    "indication": "ALL",
    "regimen": "Besponsa",
    "population": "No Subtype Specified",
    "line": "2L",
    "book": "Commercial",
    "coverage": "Medical"
  },
  {
    "_id": "5eac293b79e11113da3b1bea",
    "slug": "horizon-bcbs-nj",
    "indication": "ALL",
    "regimen": "Kymriah",
    "population": "No Subtype Specified",
    "line": "2L+",
    "book": "Commercial",
    "coverage": "Medical"
  }
]

module.exports = {
  mockPtps,
  mockInvalidData,
  mockValidSheetData,
  mockDuplicateInvalidData,
}