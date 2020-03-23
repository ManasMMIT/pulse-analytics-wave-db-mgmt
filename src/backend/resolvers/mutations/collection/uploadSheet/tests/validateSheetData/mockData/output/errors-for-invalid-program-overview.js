module.exports = [
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/medicaid",
      "schemaPath": "#/properties/medicaid/enum",
      "params": {
        "allowedValues": [
          1,
          0
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 32,
    "datum": {
      "slug": "bcbs-nc",
      "organizationType": "Alternative Payment Model",
      "organization": "BCBS NC Medical Oncology Program",
      "overview": "Cancer care quality program with enhanced reimbursement for certain cancer treatment pathways to help improve patient outcomes and manage costs for cancer care",
      "sponsor": "Payer",
      "start": "2017Q2",
      "end": "",
      "focus": "Revenue generated from reduced drug spending from practices following the pathways which have preferred therapies",
      "commercial": 1,
      "medicaid": 5,
      "medicare": 1,
      "exchange": 0
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/start",
      "schemaPath": "#/properties/start/type",
      "params": {
        "type": "string"
      },
      "message": "should be string"
    },
    "rowNum": 37,
    "datum": {
      "slug": "new-century-health",
      "organizationType": "Pathways",
      "organization": "New Century Health",
      "overview": "Recently acquired by Evolent Health (EVH), a VA-based population health company. NCH is a care management solutions that leverage technology and evidence-based medicine at the point of care with focus on oncology and cardiology",
      "sponsor": "Vendor",
      "start": [],
      "end": "",
      "focus": "Contract with payers and form alliances with key organizations (NCCN)",
      "commercial": 1,
      "medicaid": 1,
      "medicare": 1,
      "exchange": 0
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/medicare",
      "schemaPath": "#/properties/medicare/type",
      "params": {
        "type": "integer"
      },
      "message": "should be integer"
    },
    "rowNum": 38,
    "datum": {
      "slug": "oncology-analytics",
      "organizationType": "Pathways",
      "organization": "Oncology Analytics",
      "overview": "OBM with limited uptake designed to monitor compliance to Level 1 NCCN guidelines and act as peer-review for 2A and lower treatment selection",
      "sponsor": "Vendor",
      "start": "2009",
      "end": "",
      "focus": "Payer focus with minimal growth outside Humana and with a strong focus on appropriate supportive care utilization",
      "commercial": 1,
      "medicaid": 0,
      "medicare": {},
      "exchange": 0
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/medicare",
      "schemaPath": "#/properties/medicare/enum",
      "params": {
        "allowedValues": [
          1,
          0
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 38,
    "datum": {
      "slug": "oncology-analytics",
      "organizationType": "Pathways",
      "organization": "Oncology Analytics",
      "overview": "OBM with limited uptake designed to monitor compliance to Level 1 NCCN guidelines and act as peer-review for 2A and lower treatment selection",
      "sponsor": "Vendor",
      "start": "2009",
      "end": "",
      "focus": "Payer focus with minimal growth outside Humana and with a strong focus on appropriate supportive care utilization",
      "commercial": 1,
      "medicaid": 0,
      "medicare": {},
      "exchange": 0
    }
  },
  {
    "error": {
      "keyword": "type",
      "dataPath": "/commercial",
      "schemaPath": "#/properties/commercial/type",
      "params": {
        "type": "integer"
      },
      "message": "should be integer"
    },
    "rowNum": 39,
    "datum": {
      "slug": "value-pathways-nccn",
      "organizationType": "Pathways",
      "organization": "Value Pathways powered by NCCN",
      "overview": "Evolution of Level 1 Pathways (Innovent) with additional NCCN influence, to be integrated in USON EMRs with intention to expand into additional practices",
      "sponsor": "Vendor",
      "start": "2013",
      "end": "",
      "focus": "Partnership between McKesson & NCCN with limited current payer uptake",
      "commercial": [],
      "medicaid": 1,
      "medicare": 1,
      "exchange": 0
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/commercial",
      "schemaPath": "#/properties/commercial/enum",
      "params": {
        "allowedValues": [
          1,
          0
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 39,
    "datum": {
      "slug": "value-pathways-nccn",
      "organizationType": "Pathways",
      "organization": "Value Pathways powered by NCCN",
      "overview": "Evolution of Level 1 Pathways (Innovent) with additional NCCN influence, to be integrated in USON EMRs with intention to expand into additional practices",
      "sponsor": "Vendor",
      "start": "2013",
      "end": "",
      "focus": "Partnership between McKesson & NCCN with limited current payer uptake",
      "commercial": [],
      "medicaid": 1,
      "medicare": 1,
      "exchange": 0
    }
  },
  {
    "error": {
      "keyword": "enum",
      "dataPath": "/sponsor",
      "schemaPath": "#/properties/sponsor/enum",
      "params": {
        "allowedValues": [
          "Payer",
          "Internal",
          "Vendor",
          "CMS",
          "ASCO",
          "Provider"
        ]
      },
      "message": "should be equal to one of the allowed values"
    },
    "rowNum": 40,
    "datum": {
      "slug": "via-oncology",
      "organizationType": "Pathways",
      "organization": "Via Oncology",
      "overview": "Acquired by Elsevier in 1Q18, UPMC oncologist-developed pathways commercialized and adopted by practices and institutions with limited payer uptake",
      "sponsor": "Asdf",
      "start": "2005",
      "end": "",
      "focus": "Focus on providers & academic affiliations",
      "commercial": 1,
      "medicaid": 1,
      "medicare": 1,
      "exchange": 0
    }
  }
]
