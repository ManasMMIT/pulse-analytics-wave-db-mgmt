module.exports = {
  mock: {
    "tools": [
      {
        "_id": "123",
        "type": "tool",
        "name": "ResourcesTestRole",
        "order": 0,
        "componentPath": null,
      },
      {
        "_id": "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Payer Quality of Access"
        },
        "type": "tool",
        "name": "Payer Quality of Access",
        "subtitle": null,
        "caption": null,
        "order": 1,
        "componentPath": null,
        "parentId": "c7ae4f92-8343-4004-80fd-87d200f54169",
      }
    ],
    "dashboards": [
      {
        "_id": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "text": {
          "subtitle": "management",
          "caption": "management-3",
          "title": "Management"
        },
        "type": "dashboard",
        "name": "Management",
        "subtitle": "management",
        "caption": "management-3",
        "order": 2,
        "componentPath": "./Management",
        "parentId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777"
      },
      {
        "_id": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        "text": {
          "subtitle": "accounts",
          "caption": "accounts-2",
          "title": "Accounts"
        },
        "type": "dashboard",
        "name": "Accounts",
        "subtitle": "accounts",
        "caption": "accounts-2",
        "order": 3,
        "componentPath": "./Accounts",
        "parentId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777"
      }
    ],
    "pages": [
      {
        "_id": "e22232e0-72fb-462c-ac11-8c2452c287c8",
        "name": "Summary",
        "type": "page",
        "componentPath": "./Summary",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Summary"
        },
        "order": 1,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "971843b8-2c3c-4cf0-8c4a-00aed882b324",
        "name": "Quality of Access",
        "type": "page",
        "componentPath": "./QualityOfAccess",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Quality of Access"
        },
        "order": 2,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "0fd1237e-8b2c-4ad6-be02-526e24c1830b",
        "name": "Competitive Access",
        "type": "page",
        "componentPath": "./CompetitiveAccess",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Competitive Access"
        },
        "order": 4,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "0a196d08-d1d0-4e1f-9c00-81b534764709",
        "name": "Value Based Models",
        "type": "page",
        "componentPath": "./ValueBasedModels",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Value Based Models"
        },
        "order": 9,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "4e6304a5-4847-474f-a8f8-9cbeb8a77677",
        "name": "Regional Targeting",
        "type": "page",
        "componentPath": "./RegionalDrilldown",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Regional Targeting"
        },
        "order": 7,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "c85f9f2f-18ef-4164-80e9-52c07b648bb0",
        "name": "Review Timing",
        "type": "page",
        "componentPath": "./ReviewTiming",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Review Timing"
        },
        "order": 5,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "0cb6869c-d695-4d81-9ba0-7779d29dcd49",
        "name": "Strategic Accounts",
        "type": "page",
        "componentPath": "./StrategicAccounts",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Strategic Accounts"
        },
        "order": 10,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "61dbd77c-cd94-479a-83f9-f33ee83e2147",
        "name": "Reports",
        "type": "page",
        "componentPath": "./Reports",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Reports"
        },
        "order": 11,
        "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "47c48fdd-3ecf-4d0a-83d4-74b23ab69d9d",
        "name": "Summary & Engagement",
        "type": "page",
        "componentPath": "./Summary",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Summary & Engagement"
        },
        "order": 1,
        "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "1c72e538-ad22-4480-954d-001c9c7e728f",
        "name": "Overview",
        "type": "page",
        "componentPath": "./Overview",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Overview"
        },
        "order": 2,
        "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "a441ffb2-93fe-4b89-a4eb-763ff12af6bd",
        "name": "Management Capabilities",
        "type": "page",
        "componentPath": "./ManagementCapabilities",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Management Capabilities"
        },
        "order": 3,
        "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "23e889b4-fc66-4fa1-80da-155d9dec1b3b",
        "name": "Review Process",
        "type": "page",
        "componentPath": "./ReviewProcess",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Review Process"
        },
        "order": 4,
        "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "6442daa4-e318-4d97-96ca-617f124eee8e",
        "name": "Product Coverage",
        "type": "page",
        "componentPath": "./ProductCoverage",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Product Coverage"
        },
        "order": 5,
        "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
        "schemaVersion": "v1.0.0"
      }
    ],
    "cards": []
  }
}
