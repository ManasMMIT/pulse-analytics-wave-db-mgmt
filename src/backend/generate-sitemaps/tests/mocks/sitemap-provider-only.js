module.exports = {
  mock: {
    "tools": [
      {
        "_id": "123",
        "type": "tool",
        "name": "ResourcesTestRole",
        "order": 0,
        "componentPath": null,
        "resources": {
          "regionalBreakdown": [
            {
              region: "West",
              id: 2,
              state: "FOO",
              stateLong: "Foolcountry"
            },
            {
              region: "East",
              id: 3,
              state: "WA",
              stateLong: "WAGAMAMA"
            }
          ],
          "indications": [
            { _id: '4b', name: 'Soon to be activated trap card' },
            { _id: '5b', name: 'EXODIA!!' },
            { _id: '3b', name: 'Yugi\'s hair' },
          ],
          "accounts": [
            { _id: '1a', name: 'merck' },
            { _id: '2a', name: 'pegasus inc' },
            { _id: '3a', name: 'bandai' },
          ],
        }
      },
      {
        "_id": "997a3c4e-54ef-4933-8ab0-aa2a590795f0",
        "name": "Provider Key Accounts",
        "type": "tool",
        "componentPath": null,
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Provider Key Accounts"
        },
        "order": 3,
        "parentId": "bfe2ca61-e61e-4487-a160-b4cb19753228",
        "schemaVersion": "v1.0.0",
      }
    ],
    "dashboards": [
      {
        "_id": "ea6d087f-fdfb-4d44-8139-f37005ec6778",
        "name": "Accounts",
        "type": "dashboard",
        "componentPath": "./Accounts",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Accounts"
        },
        "order": 3,
        "parentId": "997a3c4e-54ef-4933-8ab0-aa2a590795f0",
        "schemaVersion": "v1.0.0",
        "icon": "accounts-2"
      },
      {
        "_id": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799",
        "name": "Management",
        "type": "dashboard",
        "componentPath": "./Management",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Management"
        },
        "order": 2,
        "parentId": "997a3c4e-54ef-4933-8ab0-aa2a590795f0",
        "schemaVersion": "v1.0.0",
        "icon": "management-3"
      },
      {
        "_id": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215",
        "name": "Overview",
        "type": "dashboard",
        "componentPath": "./Overview",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Overview"
        },
        "order": 1,
        "parentId": "997a3c4e-54ef-4933-8ab0-aa2a590795f0",
        "schemaVersion": "v1.0.0",
        "icon": "overview-2"
      }
    ],
    "pages": [
      {
        "_id": "2ccbaca5-fb76-43f2-b593-d4aeff0f1acf",
        "name": "Regional Footprint",
        "type": "page",
        "componentPath": "./RegionalFootprint",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Regional Footprint"
        },
        "order": 1,
        "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "b8a258d4-1c79-45fb-b83b-2086b28313bc",
        "name": "Internal Pharmacy",
        "type": "page",
        "componentPath": "./InternalPharmacy",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Internal Pharmacy"
        },
        "order": 2,
        "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "62d5b304-570e-40bc-a8db-563d2ed43729",
        "name": "Pathways",
        "type": "page",
        "componentPath": "./Pathways",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Pathways"
        },
        "order": 3,
        "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "48d5d5a3-5edb-41da-b050-051bd0311024",
        "name": "Alternative Payment Model",
        "type": "page",
        "componentPath": "./Apm",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Alternative Payment Model"
        },
        "order": 4,
        "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "558cced0-c6ee-4a79-b277-f62361cb693e",
        "name": "Business Model & Capabilities",
        "type": "page",
        "componentPath": "./BusinessModelCapabilities",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Business Model & Capabilities"
        },
        "order": 1,
        "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "8af8f890-0a0b-4198-9240-7efe5d24666a",
        "name": "Clinical Sophistication",
        "type": "page",
        "componentPath": "./ClinicalSophistication",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Clinical Sophistication"
        },
        "order": 2,
        "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "bdbc71cc-87b3-4762-9567-e6db78c47148",
        "name": "Value Based Care",
        "type": "page",
        "componentPath": "./ValueBasedCare",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Value Based Care"
        },
        "order": 3,
        "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778",
        "schemaVersion": "v1.0.0"
      },
      {
        "_id": "1274d924-077e-4336-8cfe-0b6a1f67880a",
        "name": "Manufacturer Engagement",
        "type": "page",
        "componentPath": "./ManufacturerEngagement",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Manufacturer Engagement"
        },
        "order": 4,
        "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778",
        "schemaVersion": "v1.0.0"
      }
    ],
    "cards": [
      {
        "_id": "becf9468-2a92-4c30-b5d1-b318a569bc7a",
        "text": {
          "subtitle": "List of valued data & education resources for account decision-making",
          "caption": "No Valued Data Sources Available",
          "title": "Valued Data Sources & Education Resources"
        },
        "type": "card",
        "name": "Valued Data Sources & Education Resources",
        "subtitle": "List of valued data & education resources for account decision-making",
        "caption": "No Valued Data Sources Available",
        "order": 1,
        "componentPath": "./ValuedDataSources",
        "parentId": "1274d924-077e-4336-8cfe-0b6a1f67880a"
      },
      {
        "_id": "75b2bc0b-c045-4aab-bec9-e46e22494361",
        "text": {
          "subtitle": "Outline of account-level manufacturer engagement restrictions & preferences",
          "caption": null,
          "title": "Manufacturer Engagement"
        },
        "type": "card",
        "name": "Manufacturer Engagement",
        "subtitle": "Outline of account-level manufacturer engagement restrictions & preferences",
        "caption": null,
        "order": 2,
        "componentPath": "./Engagement",
        "parentId": "1274d924-077e-4336-8cfe-0b6a1f67880a"
      },
      {
        "_id": "c6a2b507-36b5-4d44-a26f-f9ef1ac7deb5",
        "text": {
          "subtitle": "List of key individuals with the greatest impact on account decision making",
          "caption": "No Key Decision Makers Available",
          "title": "Key Decision Makers"
        },
        "type": "card",
        "name": "Key Decision Makers",
        "subtitle": "List of key individuals with the greatest impact on account decision making",
        "caption": "No Key Decision Makers Available",
        "order": 3,
        "componentPath": "./KeyDecisionMakers",
        "parentId": "1274d924-077e-4336-8cfe-0b6a1f67880a"
      },
      {
        "_id": "243e0fd7-6ba9-438a-a3ec-9a2324fc7308",
        "text": {
          "subtitle": null,
          "caption": "Discover trends across the entire account sample through aggregate views of the site of care mix, pharmacy capabilities, pathways, and alternative payment models.",
          "title": "Management"
        },
        "type": "card",
        "name": "Management",
        "subtitle": null,
        "caption": "Discover trends across the entire account sample through aggregate views of the site of care mix, pharmacy capabilities, pathways, and alternative payment models.",
        "order": 1,
        "componentPath": null,
        "parentId": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215"
      },
      {
        "_id": "280269f4-cc88-4f31-8c06-bdafb96cfea7",
        "text": {
          "subtitle": null,
          "caption": "In-depth account profiles detailing important operational infrastructure, clinical sophistication, cost and economic priorities, as well as key decision makers to engage.",
          "title": "Accounts"
        },
        "type": "card",
        "name": "Accounts",
        "subtitle": null,
        "caption": "In-depth account profiles detailing important operational infrastructure, clinical sophistication, cost and economic priorities, as well as key decision makers to engage.",
        "order": 2,
        "componentPath": null,
        "parentId": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215"
      },
      {
        "_id": "6c18d002-8948-41f9-a0ac-d48246959edf",
        "text": {
          "subtitle": "https://tdgwebportal.s3-us-west-2.amazonaws.com/Daiichi+Sankyo/TGCT+/Web+Tool+Tutorial+-+Daiichi+Key+Accounts+2019.pdf",
          "caption": "Walk-through of tool capabilities and functionality across the management and account dashboard views.",
          "title": "Tutorial"
        },
        "type": "card",
        "name": "Tutorial",
        "subtitle": "https://tdgwebportal.s3-us-west-2.amazonaws.com/Daiichi+Sankyo/TGCT+/Web+Tool+Tutorial+-+Daiichi+Key+Accounts+2019.pdf",
        "caption": "Walk-through of tool capabilities and functionality across the management and account dashboard views.",
        "order": 3,
        "componentPath": null,
        "parentId": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215"
      },
      {
        "_id": "7eaee61b-24c7-4c20-a0cf-744470da5c9e",
        "text": {
          "subtitle": "Location of primary account site or headquarters",
          "caption": "n = $var1 accounts (select account to view profile)",
          "title": "Site Locations"
        },
        "type": "card",
        "name": "Site Locations",
        "subtitle": "Location of primary account site or headquarters",
        "caption": "n = $var1 accounts (select account to view profile)",
        "order": 1,
        "componentPath": "./SiteLocations",
        "parentId": "2ccbaca5-fb76-43f2-b593-d4aeff0f1acf"
      },
      {
        "_id": "96f0bdc5-22be-4eea-b42c-61d028e572bc",
        "text": {
          "subtitle": "Breakdown of account site of care classification",
          "caption": null,
          "title": "Site of Care Mix"
        },
        "type": "card",
        "name": "Site of Care Mix",
        "subtitle": "Breakdown of account site of care classification",
        "caption": null,
        "order": 2,
        "componentPath": "./SiteOfCareMix",
        "parentId": "2ccbaca5-fb76-43f2-b593-d4aeff0f1acf"
      },
      {
        "_id": "5bafad9e-1481-4ea0-8a2e-88437ad2de1a",
        "text": {
          "subtitle": "Summary of account participation in value-based care programs (e.g. OCM, national & regional Alternative Payment Models). Select account to view profile.",
          "caption": null,
          "title": "Alternative Payment Model Breakdown"
        },
        "type": "card",
        "name": "Alternative Payment Model Breakdown",
        "subtitle": "Summary of account participation in value-based care programs (e.g. OCM, national & regional Alternative Payment Models). Select account to view profile.",
        "caption": null,
        "order": 1,
        "componentPath": "./Breakdown",
        "parentId": "48d5d5a3-5edb-41da-b050-051bd0311024"
      },
      {
        "_id": "0b89b1d0-5f8c-4aff-a9f4-3633e755a463",
        "text": {
          "subtitle": "Annual Medicare patient volume based on diagnosis code records",
          "caption": "Note: sourced from Medicare claims data from 2017 Medicare SAF (1/1/2017 - 12/31/2017) via ICD‌-9 codes; not mutually exclusive",
          "title": "Annual Patient Volume by Indication"
        },
        "type": "card",
        "name": "Annual Patient Volume by Indication",
        "subtitle": "Annual Medicare patient volume based on diagnosis code records",
        "caption": "Note: sourced from Medicare claims data from 2017 Medicare SAF (1/1/2017 - 12/31/2017) via ICD‌-9 codes; not mutually exclusive",
        "order": 2,
        "componentPath": "./PatientVolume",
        "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
      },
      {
        "_id": "d72abd12-9f21-4c6d-81e2-02bdbed9b28a",
        "text": {
          "subtitle": "Based on Medicare cost report financials & claims data",
          "caption": "Note: Payer mix based on % of total charges; top 3 payers listed by percent of total claims volume from Medicare report financials; Commercial & Self - Pay reported in aggregate",
          "title": "Payer Mix"
        },
        "type": "card",
        "name": "Payer Mix",
        "subtitle": "Based on Medicare cost report financials & claims data",
        "caption": "Note: Payer mix based on % of total charges; top 3 payers listed by percent of total claims volume from Medicare report financials; Commercial & Self - Pay reported in aggregate",
        "order": 3,
        "componentPath": "./PayerMix",
        "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
      },
      {
        "_id": "9c783113-d602-4d1c-b957-1285e1cfc53a",
        "text": {
          "subtitle": "Overview of account sophistication by EMR, procurement & pharmacy capabilities",
          "caption": null,
          "title": "Operational Infrastructure"
        },
        "type": "card",
        "name": "Operational Infrastructure",
        "subtitle": "Overview of account sophistication by EMR, procurement & pharmacy capabilities",
        "caption": null,
        "order": 4,
        "componentPath": "./OperationalInfrastructure",
        "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
      },
      {
        "_id": "bbb887d7-652d-49a9-9f6d-4bf2e46a5a5c",
        "text": {
          "subtitle": "Outline of key market events & innovative account partnerships",
          "caption": "No partnership data available",
          "title": "M&A, Affiliations, Academic Partnerships"
        },
        "type": "card",
        "name": "M&A, Affiliations, Academic Partnerships",
        "subtitle": "Outline of key market events & innovative account partnerships",
        "caption": "No partnership data available",
        "order": 5,
        "componentPath": "./Partnerships",
        "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
      },
      {
        "_id": "019ff077-80d3-4339-8f57-b51a5148366a",
        "text": {
          "subtitle": "Summary of account participation in 3rd party or internal pathways",
          "caption": null,
          "title": "Pathways"
        },
        "type": "card",
        "name": "Pathways",
        "subtitle": "Summary of account participation in 3rd party or internal pathways",
        "caption": null,
        "order": 1,
        "componentPath": "./PathwaysCard",
        "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
      },
      {
        "_id": "f6b43c18-bce3-4b41-a0cb-fe80cd20fb17",
        "text": {
          "subtitle": "Breakdown of 3rd party pathways vendors & participating accounts",
          "caption": "% of accounts, n = $var1",
          "title": "3rd Party Pathways"
        },
        "type": "card",
        "name": "3rd Party Pathways",
        "subtitle": "Breakdown of 3rd party pathways vendors & participating accounts",
        "caption": "% of accounts, n = $var1",
        "order": 2,
        "componentPath": "./ThirdParty",
        "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
      },
      {
        "_id": "721a3059-07db-4370-8d05-d3e4138435c6",
        "text": {
          "subtitle": "Level of pathways integration across all account sites & EMR",
          "caption": null,
          "title": "3rd Party & Internal Pathways Integration"
        },
        "type": "card",
        "name": "3rd Party & Internal Pathways Integration",
        "subtitle": "Level of pathways integration across all account sites & EMR",
        "caption": null,
        "order": 3,
        "componentPath": "./Integration",
        "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
      },
      {
        "_id": "c24716c7-60c6-4361-acc5-7f47410719bc",
        "text": {
          "subtitle": "Strategies utilized in order to enforce adherence to internal pathways",
          "caption": null,
          "title": "3rd Party & Internal Pathways Policing Mechanisms"
        },
        "type": "card",
        "name": "3rd Party & Internal Pathways Policing Mechanisms",
        "subtitle": "Strategies utilized in order to enforce adherence to internal pathways",
        "caption": null,
        "order": 4,
        "componentPath": "./PolicingMechanisms",
        "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
      },
      {
        "_id": "f7109724-921e-4a46-b95f-d4cedee6c018",
        "text": {
          "subtitle": "Degree of involvement with standard of care development",
          "caption": null,
          "title": "Clinical Designations"
        },
        "type": "card",
        "name": "Clinical Designations",
        "subtitle": "Degree of involvement with standard of care development",
        "caption": null,
        "order": 1,
        "componentPath": "./ClinicalDesignations",
        "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
      },
      {
        "_id": "a654d872-2532-42dd-834e-78328d6d32e7",
        "text": {
          "subtitle": "Summary of trial participation across $var1",
          "caption": null,
          "title": "Clinical Trials Volume"
        },
        "type": "card",
        "name": "Clinical Trials Volume",
        "subtitle": "Summary of trial participation across $var1",
        "caption": null,
        "order": 2,
        "componentPath": "./ClinicalTrials",
        "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
      },
      {
        "_id": "4843f4ed-6c04-4d1a-a525-60aa13aeb312",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Biomarker Testing"
        },
        "type": "card",
        "name": "Biomarker Testing",
        "subtitle": null,
        "caption": null,
        "order": 3,
        "componentPath": "./BiomarkerTesting",
        "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
      },
      {
        "_id": "40de33a3-1c82-49dd-9176-3ace57bfa58a",
        "text": {
          "subtitle": null,
          "caption": null,
          "title": "Patient Flow"
        },
        "type": "card",
        "name": "Patient Flow",
        "subtitle": null,
        "caption": null,
        "order": 4,
        "componentPath": "./PatientFlow",
        "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
      },
      {
        "_id": "b6acac5f-ad56-45eb-a6b4-b5cc31160447",
        "text": {
          "subtitle": null,
          "caption": "No NCCN Panel Members",
          "title": "NCCN Panel Members (KOLs)"
        },
        "type": "card",
        "name": "NCCN Panel Members (KOLs)",
        "subtitle": null,
        "caption": "No NCCN Panel Members",
        "order": 5,
        "componentPath": "./PanelMembers",
        "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
      },
      {
        "_id": "b67bb671-fc23-46b3-bfa6-c1f73ad1ad31",
        "text": {
          "subtitle": "Overview of accounts that have internal dispensing & support capabilities for specialty therapeutics",
          "caption": null,
          "title": "Internal Dispensing"
        },
        "type": "card",
        "name": "Internal Dispensing",
        "subtitle": "Overview of accounts that have internal dispensing & support capabilities for specialty therapeutics",
        "caption": null,
        "order": 1,
        "componentPath": "./InternalPharmCard",
        "parentId": "b8a258d4-1c79-45fb-b83b-2086b28313bc"
      },
      {
        "_id": "e18fcf90-9f82-4ca8-b54f-1902cedd0ded",
        "text": {
          "subtitle": "Whether accounts have key pharmacy accreditations, indicating dispensing sophistication",
          "caption": null,
          "title": "Specialty Pharmacy Accreditation"
        },
        "type": "card",
        "name": "Specialty Pharmacy Accreditation",
        "subtitle": "Whether accounts have key pharmacy accreditations, indicating dispensing sophistication",
        "caption": null,
        "order": 2,
        "componentPath": "./PharmacyAcc",
        "parentId": "b8a258d4-1c79-45fb-b83b-2086b28313bc"
      },
      {
        "_id": "f564a089-df22-41bd-b4d2-f8ca71b84a52",
        "text": {
          "subtitle": "Summary of account participation in 3rd party or internal pathways",
          "caption": null,
          "title": "3rd Party & Internal Pathways"
        },
        "type": "card",
        "name": "3rd Party & Internal Pathways",
        "subtitle": "Summary of account participation in 3rd party or internal pathways",
        "caption": null,
        "order": 1,
        "componentPath": "./InternalPartyPathways",
        "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
      },
      {
        "_id": "f4f4787a-83d2-4ba3-aedc-c10996993ee0",
        "text": {
          "subtitle": "Pathways positioning of key brands vs. competitors for priority indications",
          "caption": "No Internal or 3rd Party Pathways available at this time.",
          "title": "$var1"
        },
        "type": "card",
        "name": "$var1",
        "subtitle": "Pathways positioning of key brands vs. competitors for priority indications",
        "caption": "No Internal or 3rd Party Pathways available at this time.",
        "order": 2,
        "componentPath": "./PathwaysCoverage",
        "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
      },
      {
        "_id": "85c525d9-0188-4ed0-bab8-cb81debdd7c6",
        "text": {
          "subtitle": null,
          "caption": "No APMs or Quality Programs",
          "title": "Alternative Payment Model / Quality Program"
        },
        "type": "card",
        "name": "Alternative Payment Model / Quality Program",
        "subtitle": null,
        "caption": "No APMs or Quality Programs",
        "order": 3,
        "componentPath": "./ApmProgram",
        "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
      },
      {
        "_id": "6c3b140a-a1e0-44d7-a333-cb1b5f1aca3f",
        "text": {
          "subtitle": "Key stakeholders involved with pathways decision-making",
          "caption": "No Pathways Influencers",
          "title": "$var1"
        },
        "type": "card",
        "name": "$var1",
        "subtitle": "Key stakeholders involved with pathways decision-making",
        "caption": "No Pathways Influencers",
        "order": 4,
        "componentPath": "./PathwaysInfluencers",
        "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
      },
      {
        "_id": "9495c3bb-ab1c-417c-ab49-b74adfbcef4b",
        "name": "Staffing",
        "type": "card",
        "componentPath": "./Staffing",
        "text": {
          "subtitle": "Oncologist & supportive care staffing",
          "caption": "Physicians by primary specialty (based on staff with primary affiliation to account hospitals / affiliated locations)",
          "title": "Staffing"
        },
        "order": 1,
        "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e",
        "schemaVersion": "v1.0.0",
        "caption": "Physicians by primary specialty (based on staff with primary affiliation to account hospitals / affiliated locations)",
        "subtitle": "Oncologist & supportive care staffing"
      }
    ]
  }
}
