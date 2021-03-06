const { ObjectId } = require('mongodb')

module.exports = {
  "_id": ObjectId("5e736d74b6f1bf57a480ea1e"),
  "name": "Influencers",
  "collection": "pathwaysInfluencers",
  "fields": [
    {
      "_id": ObjectId("5e736d74b6f1bf57a480ea1f"),
      "type": "string",
      "name": "slug",
      "oneOf": [
        "uhc-pathways",
        "aetna-oncology",
        "aim",
        "anthem-cancer-care",
        "asco-come-home",
        "bcbs-al",
        "bcbs-il-oncology",
        "bcbs-ma",
        "bcbs-nc",
        "bcbs-nm",
        "bcbs-sc",
        "bcbs-tn",
        "bcbs-wny",
        "capital-bc",
        "cigna-collaborative-care",
        "come-home",
        "eviti",
        "florida-blue",
        "harvard-pilgrim",
        "highmark-cancer-collaborative",
        "horizon",
        "ibc",
        "medica",
        "new-century-health",
        "oncology-analytics",
        "oncology-care-model",
        "optima-health",
        "premera-blue-cross",
        "priority-health",
        "uhc-innovative-care",
        "value-pathways-nccn",
        "via-oncology",
        "humana-oncology-model-of-care",
        "evicore",
        "healthhelp",
        "magellanRx",
        "novologix"
      ]
    },
    {
      "_id": ObjectId("5e736d9eb6f1bf57a480ea20"),
      "type": "string",
      "oneOf": [
        "Pathways",
        "Pathways - NCCN",
        "Pathways - Removed",
        "Pathways - Future",
        "Pathways - Outdated",
        "Pathways - To Vet",
        "Pathways - Outdated 18Q3",
        "Alternative Payment Model",
        "Alternative Payment Model - Outdated",
        "OBM"
      ],
      "name": "organizationType"
    },
    {
      "_id": ObjectId("5e736dacb6f1bf57a480ea21"),
      "type": "string",
      "name": "organization",
      "oneOf": [
        "UHC Cancer Therapy Pathways",
        "Aetna Oncology Medical Home",
        "AIM",
        "All APMs",
        "All Pathways",
        "Anthem Cancer Care Quality Program",
        "ASCO Come Home",
        "BCBS AL Oncology Select",
        "BCBS IL Oncology Intensive Medical Home",
        "BCBS MA",
        "BCBS NC Medical Oncology Program",
        "BCBS NM Oncology Quality Program",
        "BCBS SC",
        "BCBS TN",
        "BCBS WNY",
        "Capital BC",
        "Cigna Collaborative Care",
        "COME HOME",
        "eviCore",
        "eviti",
        "Florida Blue",
        "Harvard Pilgrim",
        "HealthHelp",
        "Highmark Cancer Collaborative",
        "Horizon",
        "IBC",
        "KP-Beacon",
        "Magellan Rx",
        "Medica",
        "MI Oncology Pathways",
        "Moffitt Oncology Network",
        "NCCA",
        "New Century Health",
        "Novologix",
        "Oncology Analytics",
        "Oncology Care Model",
        "Optima Health",
        "P4 / Cardinal",
        "Premera Blue Cross",
        "Priority Health MOMHDP",
        "UHC Innovative Cancer Care",
        "Value Pathways powered by NCCN",
        "Via Oncology",
        "Humana Oncology Model of Care",
        "NCCN"
      ]
    },
    {
      "_id": ObjectId("5e736dc3b6f1bf57a480ea22"),
      "type": "string",
      "oneOf": null,
      "name": "member"
    },
    {
      "_id": ObjectId("5e736dccb6f1bf57a480ea23"),
      "type": "string",
      "oneOf": null,
      "name": "npiNumber"
    },
    {
      "_id": ObjectId("5e736dedb6f1bf57a480ea24"),
      "type": "string",
      "oneOf": [
        "Leadership",
        "Steering Committee"
      ],
      "name": "influencerType"
    },
    {
      "_id": ObjectId("5e736df6b6f1bf57a480ea25"),
      "type": "string",
      "oneOf": null,
      "name": "title"
    },
    {
      "_id": ObjectId("5e736e01b6f1bf57a480ea26"),
      "type": "string",
      "oneOf": null,
      "name": "affiliation"
    },
    {
      "_id": ObjectId("5e736e0eb6f1bf57a480ea27"),
      "type": "string",
      "oneOf": null,
      "name": "affiliationPosition"
    },
    {
      "_id": ObjectId("5e736e14b6f1bf57a480ea28"),
      "type": "string",
      "oneOf": null,
      "name": "primaryState"
    },
    {
      "_id": ObjectId("5e736e1eb6f1bf57a480ea29"),
      "type": "csv",
      "name": "indication",
      "oneOf": [
        "AD",
        "ALL",
        "AML",
        "Anti-Emetics",
        "Asthma",
        "Atopic Dermatitis",
        "Basal Cell Carcinoma",
        "Breast Cancer",
        "Cervical",
        "cHL",
        "CINV",
        "CLL",
        "CML",
        "Colorectal Cancer",
        "Chronic Immune Thrombocytopenia (cITP)",
        "CRPC",
        "CSCC",
        "CSPC",
        "DLBCL",
        "Endometrial",
        "Esophageal",
        "Febrile Neutropenia",
        "Follicular Lymphoma",
        "Gastric",
        "GIST",
        "Glioblastoma",
        "General",
        "GVHD",
        "HCC",
        "HCL",
        "Head & Neck",
        "Indication-Agnostic Solid Tumors",
        "Lymphoma",
        "MCC",
        "MCL",
        "MDS",
        "Melanoma",
        "MSI-H (Bone)",
        "MSI-H (Breast)",
        "MSI-H (Cervical)",
        "MSI-H (CRC)",
        "MSI-H (Endometrial)",
        "MSI-H (Esophageal)",
        "MSI-H (Gastric)",
        "MSI-H (NET)",
        "MSI-H (Ovarian)",
        "MSI-H (Pancreatic)",
        "MSI-H (Penile)",
        "MSI-H (Prostate)",
        "MSI-H (Solid Tumors)",
        "Multiple Myeloma",
        "Myelofibrosis",
        "MZL",
        "nmCRPC",
        "Non-pancreatic NET",
        "NSCLC",
        "Ovarian",
        "Pancreatic",
        "PMBCL",
        "PNET",
        "PTCL",
        "PTCL - AITL",
        "PTCL - NOS",
        "PTCL - pcALCL",
        "PTCL - sALCL",
        "RCC",
        "sALCL",
        "SCLC",
        "Severe Neutropenia",
        "STS",
        "TGCT",
        "TGCT / PVNS",
        "Thyroid Carcinoma",
        "TNBC",
        "Triple-negative Breast Cancer",
        "Urothelial",
        "WM"
      ]
    },
    {
      "_id": ObjectId("5e736e32b6f1bf57a480ea2a"),
      "type": "string",
      "oneOf": null,
      "name": "indicationCategory"
    },
    {
      "_id": ObjectId("5e736e39b6f1bf57a480ea2b"),
      "type": "string",
      "oneOf": null,
      "name": "priority"
    },
    {
      "_id": ObjectId("5e736e3fb6f1bf57a480ea2c"),
      "type": "string",
      "oneOf": null,
      "name": "startDate"
    },
    {
      "_id": ObjectId("5e736e46b6f1bf57a480ea2d"),
      "type": "string",
      "oneOf": null,
      "name": "alertDate"
    },
    {
      "_id": ObjectId("5e736e4bb6f1bf57a480ea2e"),
      "type": "string",
      "oneOf": null,
      "name": "alertType"
    },
    {
      "_id": ObjectId("5e736e54b6f1bf57a480ea2f"),
      "type": "string",
      "oneOf": null,
      "name": "alertDescription"
    }
  ],
}
