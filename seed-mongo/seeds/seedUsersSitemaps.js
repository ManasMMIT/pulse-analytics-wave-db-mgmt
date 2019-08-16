const _ = require('lodash');
/*
  const exampleOutputDocument = {
    _id,
    username,
    sitemap, // old, psql sitemap
    newSitemap, // new, multiple roles combined sitemap
    client: {
      _id,
      name,
      description
    },
    schemaVersion
  }

  ! Just need to throw joined newSitemap
*/

const getCombinedSitemaps = sitemaps => {
  const combinedSitemaps = {}
  for (const sitemap of sitemaps) {
    Object.keys(sitemap).forEach(nodeType => {
      const nodes = sitemap[nodeType]

      if (!combinedSitemaps[nodeType]) {
        combinedSitemaps[nodeType] = nodes
      } else {
        combinedSitemaps[nodeType] = combinedSitemaps[nodeType]
          .concat(nodes)

        combinedSitemaps[nodeType] = _.uniq(
          combinedSitemaps[nodeType],
          '_id'
        )
        combinedSitemaps[nodeType] = _.sortBy(
          combinedSitemaps[nodeType],
          'order'
        )
      }
    })
  }

  return combinedSitemaps;
}

module.exports = async (core, dev, prod) => {
  const DevUsers = dev.collection('users.sitemaps');
  const CoreRoles = core.collection('roles');

  const users = await DevUsers.find().toArray();

  for (const user of users) {
    const userRoles = await CoreRoles
      .find({ 'users._id': user._id }).toArray();

    const userRolesNewSitemaps = userRoles
      .map(({ newSitemap }) => newSitemap);
    
    const combinedNewSitemap = getCombinedSitemaps(userRolesNewSitemaps);

    const client = userRoles.length ? userRoles[0].client : null

    await DevUsers.updateOne(
      { _id: user._id },
      { $set: {
          newSitemap: combinedNewSitemap,
          client,
          schemaVersion: 'v1.1.0',
        }
      }
    );
  }
}

// const payerSitemap = {
//   "tools": [
//     {
//       "_id": "a3f419de-ca7d-4498-94dd-04fb9f6b8777",
//       "type": "tool",
//       "name": "Payer Quality of Access",
//       "subtitle": null,
//       "caption": null,
//       "order": 1,
//       "componentPath": null,
//       "parentId": "c7ae4f92-8343-4004-80fd-87d200f54169"
//     }
//   ],
//   "dashboards": [
//     {
//       "_id": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7",
//       "type": "dashboard",
//       "name": "Management",
//       "subtitle": "management",
//       "caption": "management-3",
//       "order": 2,
//       "componentPath": "./Management",
//       "parentId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777"
//     },
//     {
//       "_id": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52",
//       "type": "dashboard",
//       "name": "Accounts",
//       "subtitle": "accounts",
//       "caption": "accounts-2",
//       "order": 3,
//       "componentPath": "./Accounts",
//       "parentId": "a3f419de-ca7d-4498-94dd-04fb9f6b8777"
//     }
//   ],
//   "pages": [
//     {
//       "_id": "47c48fdd-3ecf-4d0a-83d4-74b23ab69d9d",
//       "type": "page",
//       "name": "Summary & Engagement",
//       "subtitle": null,
//       "caption": null,
//       "order": 1,
//       "componentPath": null,
//       "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52"
//     },
//     {
//       "_id": "1c72e538-ad22-4480-954d-001c9c7e728f",
//       "type": "page",
//       "name": "Overview",
//       "subtitle": null,
//       "caption": null,
//       "order": 2,
//       "componentPath": null,
//       "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52"
//     },
//     {
//       "_id": "a441ffb2-93fe-4b89-a4eb-763ff12af6bd",
//       "type": "page",
//       "name": "Management Capabilities",
//       "subtitle": null,
//       "caption": null,
//       "order": 3,
//       "componentPath": null,
//       "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52"
//     },
//     {
//       "_id": "23e889b4-fc66-4fa1-80da-155d9dec1b3b",
//       "type": "page",
//       "name": "Review Process",
//       "subtitle": null,
//       "caption": null,
//       "order": 4,
//       "componentPath": null,
//       "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52"
//     },
//     {
//       "_id": "6442daa4-e318-4d97-96ca-617f124eee8e",
//       "type": "page",
//       "name": "Product Coverage",
//       "subtitle": null,
//       "caption": null,
//       "order": 5,
//       "componentPath": null,
//       "parentId": "25fde1b5-4c24-4d8a-ad89-aa4afaca4c52"
//     },
//     {
//       "_id": "e22232e0-72fb-462c-ac11-8c2452c287c8",
//       "type": "page",
//       "name": "Summary",
//       "subtitle": null,
//       "caption": null,
//       "order": 1,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "971843b8-2c3c-4cf0-8c4a-00aed882b324",
//       "type": "page",
//       "name": "Quality of Access",
//       "subtitle": null,
//       "caption": null,
//       "order": 2,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "0fd1237e-8b2c-4ad6-be02-526e24c1830b",
//       "type": "page",
//       "name": "Competitive Access",
//       "subtitle": null,
//       "caption": null,
//       "order": 4,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "c85f9f2f-18ef-4164-80e9-52c07b648bb0",
//       "type": "page",
//       "name": "Review Timing",
//       "subtitle": null,
//       "caption": null,
//       "order": 5,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "4e6304a5-4847-474f-a8f8-9cbeb8a77677",
//       "type": "page",
//       "name": "Regional Targeting",
//       "subtitle": null,
//       "caption": null,
//       "order": 7,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "0a196d08-d1d0-4e1f-9c00-81b534764709",
//       "type": "page",
//       "name": "Value Based Models",
//       "subtitle": null,
//       "caption": null,
//       "order": 9,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "0cb6869c-d695-4d81-9ba0-7779d29dcd49",
//       "type": "page",
//       "name": "Strategic Accounts",
//       "subtitle": null,
//       "caption": null,
//       "order": 10,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     },
//     {
//       "_id": "61dbd77c-cd94-479a-83f9-f33ee83e2147",
//       "type": "page",
//       "name": "Reports",
//       "subtitle": null,
//       "caption": null,
//       "order": 11,
//       "componentPath": null,
//       "parentId": "db5a25db-a2c2-4da5-8bf7-c80e42cc13f7"
//     }
//   ],
//   "cards": []
// }

// const providerSitemap = {
//   "tools": [
//     {
//       "_id": "997a3c4e-54ef-4933-8ab0-aa2a590795f0",
//       "type": "tool",
//       "name": "Provider Key Accounts",
//       "subtitle": null,
//       "caption": null,
//       "order": 3,
//       "componentPath": null,
//       "parentId": "3556819c-9be6-4e78-921b-3f5f0b4be8f6"
//     }
//   ],
//   "dashboards": [
//     {
//       "_id": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215",
//       "type": "dashboard",
//       "name": "Overview",
//       "subtitle": null,
//       "caption": null,
//       "order": 1,
//       "componentPath": null,
//       "parentId": "997a3c4e-54ef-4933-8ab0-aa2a590795f0"
//     },
//     {
//       "_id": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799",
//       "type": "dashboard",
//       "name": "Management",
//       "subtitle": null,
//       "caption": null,
//       "order": 2,
//       "componentPath": null,
//       "parentId": "997a3c4e-54ef-4933-8ab0-aa2a590795f0"
//     },
//     {
//       "_id": "ea6d087f-fdfb-4d44-8139-f37005ec6778",
//       "type": "dashboard",
//       "name": "Accounts",
//       "subtitle": null,
//       "caption": null,
//       "order": 3,
//       "componentPath": null,
//       "parentId": "997a3c4e-54ef-4933-8ab0-aa2a590795f0"
//     }
//   ],
//   "pages": [
//     {
//       "_id": "2ccbaca5-fb76-43f2-b593-d4aeff0f1acf",
//       "type": "page",
//       "name": "Regional Footprint",
//       "subtitle": null,
//       "caption": null,
//       "order": 1,
//       "componentPath": null,
//       "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799"
//     },
//     {
//       "_id": "b8a258d4-1c79-45fb-b83b-2086b28313bc",
//       "type": "page",
//       "name": "Internal Pharmacy",
//       "subtitle": null,
//       "caption": null,
//       "order": 2,
//       "componentPath": null,
//       "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799"
//     },
//     {
//       "_id": "62d5b304-570e-40bc-a8db-563d2ed43729",
//       "type": "page",
//       "name": "Pathways",
//       "subtitle": null,
//       "caption": null,
//       "order": 3,
//       "componentPath": null,
//       "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799"
//     },
//     {
//       "_id": "48d5d5a3-5edb-41da-b050-051bd0311024",
//       "type": "page",
//       "name": "Alternative Payment Model",
//       "subtitle": null,
//       "caption": null,
//       "order": 4,
//       "componentPath": null,
//       "parentId": "9ac1ed2e-a2ff-4135-a3de-7b9d93260799"
//     },
//     {
//       "_id": "558cced0-c6ee-4a79-b277-f62361cb693e",
//       "type": "page",
//       "name": "Business Model & Capabilities",
//       "subtitle": null,
//       "caption": null,
//       "order": 1,
//       "componentPath": null,
//       "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778"
//     },
//     {
//       "_id": "8af8f890-0a0b-4198-9240-7efe5d24666a",
//       "type": "page",
//       "name": "Clinical Sophistication",
//       "subtitle": null,
//       "caption": null,
//       "order": 2,
//       "componentPath": null,
//       "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778"
//     },
//     {
//       "_id": "bdbc71cc-87b3-4762-9567-e6db78c47148",
//       "type": "page",
//       "name": "Value Based Care",
//       "subtitle": null,
//       "caption": null,
//       "order": 3,
//       "componentPath": null,
//       "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778"
//     },
//     {
//       "_id": "1274d924-077e-4336-8cfe-0b6a1f67880a",
//       "type": "page",
//       "name": "Manufacturer Engagement",
//       "subtitle": null,
//       "caption": null,
//       "order": 4,
//       "componentPath": null,
//       "parentId": "ea6d087f-fdfb-4d44-8139-f37005ec6778"
//     }
//   ],
//   "cards": [
//     {
//       "_id": "becf9468-2a92-4c30-b5d1-b318a569bc7a",
//       "type": "card",
//       "name": "Valued Data Sources & Education Resources",
//       "subtitle": "List of valued data & education resources for account decision-making",
//       "caption": "No Valued Data Sources Available",
//       "order": 1,
//       "componentPath": "./ValuedDataSources",
//       "parentId": "1274d924-077e-4336-8cfe-0b6a1f67880a"
//     },
//     {
//       "_id": "75b2bc0b-c045-4aab-bec9-e46e22494361",
//       "type": "card",
//       "name": "Manufacturer Engagement",
//       "subtitle": "Outline of account-level manufacturer engagement restrictions & preferences",
//       "caption": null,
//       "order": 2,
//       "componentPath": "./Engagement",
//       "parentId": "1274d924-077e-4336-8cfe-0b6a1f67880a"
//     },
//     {
//       "_id": "c6a2b507-36b5-4d44-a26f-f9ef1ac7deb5",
//       "type": "card",
//       "name": "Key Decision Makers",
//       "subtitle": "List of key individuals with the greatest impact on account decision making",
//       "caption": "No Key Decision Makers Available",
//       "order": 3,
//       "componentPath": "./KeyDecisionMakers",
//       "parentId": "1274d924-077e-4336-8cfe-0b6a1f67880a"
//     },
//     {
//       "_id": "243e0fd7-6ba9-438a-a3ec-9a2324fc7308",
//       "type": "card",
//       "name": "Management",
//       "subtitle": null,
//       "caption": "Discover trends across the entire account sample through aggregate views of the site of care mix, pharmacy capabilities, pathways, and alternative payment models.",
//       "order": 1,
//       "componentPath": null,
//       "parentId": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215"
//     },
//     {
//       "_id": "280269f4-cc88-4f31-8c06-bdafb96cfea7",
//       "type": "card",
//       "name": "Accounts",
//       "subtitle": null,
//       "caption": "In-depth account profiles detailing important operational infrastructure, clinical sophistication, cost and economic priorities, as well as key decision makers to engage.",
//       "order": 2,
//       "componentPath": null,
//       "parentId": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215"
//     },
//     {
//       "_id": "6c18d002-8948-41f9-a0ac-d48246959edf",
//       "type": "card",
//       "name": "Tutorial",
//       "subtitle": "https://tdgwebportal.s3-us-west-2.amazonaws.com/Daiichi+Sankyo/TGCT+/Web+Tool+Tutorial+-+Daiichi+Key+Accounts+2019.pdf",
//       "caption": "Walk-through of tool capabilities and functionality across the management and account dashboard views.",
//       "order": 3,
//       "componentPath": null,
//       "parentId": "1a6a7cf4-df8a-45b1-ab90-0f32b828b215"
//     },
//     {
//       "_id": "7eaee61b-24c7-4c20-a0cf-744470da5c9e",
//       "type": "card",
//       "name": "Site Locations",
//       "subtitle": "Location of primary account site or headquarters",
//       "caption": "n = $var1 accounts (select account to view profile)",
//       "order": 1,
//       "componentPath": "./SiteLocations",
//       "parentId": "2ccbaca5-fb76-43f2-b593-d4aeff0f1acf"
//     },
//     {
//       "_id": "96f0bdc5-22be-4eea-b42c-61d028e572bc",
//       "type": "card",
//       "name": "Site of Care Mix",
//       "subtitle": "Breakdown of account site of care classification",
//       "caption": null,
//       "order": 2,
//       "componentPath": "./SiteOfCareMix",
//       "parentId": "2ccbaca5-fb76-43f2-b593-d4aeff0f1acf"
//     },
//     {
//       "_id": "5bafad9e-1481-4ea0-8a2e-88437ad2de1a",
//       "type": "card",
//       "name": "Alternative Payment Model Breakdown",
//       "subtitle": "Summary of account participation in value-based care programs (e.g. OCM, national & regional Alternative Payment Models). Select account to view profile.",
//       "caption": null,
//       "order": 1,
//       "componentPath": "./Breakdown",
//       "parentId": "48d5d5a3-5edb-41da-b050-051bd0311024"
//     },
//     {
//       "_id": "9495c3bb-ab1c-417c-ab49-b74adfbcef4b",
//       "type": "card",
//       "name": "Staffing",
//       "subtitle": "",
//       "caption": "Physicians by primary specialty (based on staff with primary affiliation to account hospitals / affiliated locations)",
//       "order": 1,
//       "componentPath": "./Staffing",
//       "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
//     },
//     {
//       "_id": "0b89b1d0-5f8c-4aff-a9f4-3633e755a463",
//       "type": "card",
//       "name": "Annual Patient Volume by Indication",
//       "subtitle": "Annual Medicare patient volume based on diagnosis code records",
//       "caption": "Note: sourced from Medicare claims data from 2017 Medicare SAF (1/1/2017 - 12/31/2017) via ICD\u200c-9 codes; not mutually exclusive",
//       "order": 2,
//       "componentPath": "./PatientVolume",
//       "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
//     },
//     {
//       "_id": "d72abd12-9f21-4c6d-81e2-02bdbed9b28a",
//       "type": "card",
//       "name": "Payer Mix",
//       "subtitle": "Based on Medicare cost report financials & claims data",
//       "caption": "Note: Payer mix based on % of total charges; top 3 payers listed by percent of total claims volume from Medicare report financials; Commercial & Self - Pay reported in aggregate",
//       "order": 3,
//       "componentPath": "./PayerMix",
//       "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
//     },
//     {
//       "_id": "9c783113-d602-4d1c-b957-1285e1cfc53a",
//       "type": "card",
//       "name": "Operational Infrastructure",
//       "subtitle": "Overview of account sophistication by EMR, procurement & pharmacy capabilities",
//       "caption": null,
//       "order": 4,
//       "componentPath": "./OperationalInfrastructure",
//       "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
//     },
//     {
//       "_id": "bbb887d7-652d-49a9-9f6d-4bf2e46a5a5c",
//       "type": "card",
//       "name": "M&A, Affiliations, Academic Partnerships",
//       "subtitle": "Outline of key market events & innovative account partnerships",
//       "caption": "No partnership data available",
//       "order": 5,
//       "componentPath": "./Partnerships",
//       "parentId": "558cced0-c6ee-4a79-b277-f62361cb693e"
//     },
//     {
//       "_id": "019ff077-80d3-4339-8f57-b51a5148366a",
//       "type": "card",
//       "name": "Pathways",
//       "subtitle": "Summary of account participation in 3rd party or internal pathways",
//       "caption": null,
//       "order": 1,
//       "componentPath": "./PathwaysCard",
//       "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
//     },
//     {
//       "_id": "f6b43c18-bce3-4b41-a0cb-fe80cd20fb17",
//       "type": "card",
//       "name": "3rd Party Pathways",
//       "subtitle": "Breakdown of 3rd party pathways vendors & participating accounts",
//       "caption": "% of accounts, n = $var1",
//       "order": 2,
//       "componentPath": "./ThirdParty",
//       "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
//     },
//     {
//       "_id": "721a3059-07db-4370-8d05-d3e4138435c6",
//       "type": "card",
//       "name": "3rd Party & Internal Pathways Integration",
//       "subtitle": "Level of pathways integration across all account sites & EMR",
//       "caption": null,
//       "order": 3,
//       "componentPath": "./Integration",
//       "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
//     },
//     {
//       "_id": "c24716c7-60c6-4361-acc5-7f47410719bc",
//       "type": "card",
//       "name": "3rd Party & Internal Pathways Policing Mechanisms",
//       "subtitle": "Strategies utilized in order to enforce adherence to internal pathways",
//       "caption": null,
//       "order": 4,
//       "componentPath": "./PolicingMechanisms",
//       "parentId": "62d5b304-570e-40bc-a8db-563d2ed43729"
//     },
//     {
//       "_id": "f7109724-921e-4a46-b95f-d4cedee6c018",
//       "type": "card",
//       "name": "Clinical Designations",
//       "subtitle": "Degree of involvement with standard of care development",
//       "caption": null,
//       "order": 1,
//       "componentPath": "./ClinicalDesignations",
//       "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
//     },
//     {
//       "_id": "a654d872-2532-42dd-834e-78328d6d32e7",
//       "type": "card",
//       "name": "Clinical Trials Volume",
//       "subtitle": "Summary of trial participation across $var1, and $var2",
//       "caption": null,
//       "order": 2,
//       "componentPath": "./ClinicalTrials",
//       "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
//     },
//     {
//       "_id": "4843f4ed-6c04-4d1a-a525-60aa13aeb312",
//       "type": "card",
//       "name": "Biomarker Testing",
//       "subtitle": null,
//       "caption": null,
//       "order": 3,
//       "componentPath": "./BiomarkerTesting",
//       "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
//     },
//     {
//       "_id": "40de33a3-1c82-49dd-9176-3ace57bfa58a",
//       "type": "card",
//       "name": "Patient Flow",
//       "subtitle": null,
//       "caption": null,
//       "order": 4,
//       "componentPath": "./PatientFlow",
//       "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
//     },
//     {
//       "_id": "b6acac5f-ad56-45eb-a6b4-b5cc31160447",
//       "type": "card",
//       "name": "NCCN Panel Members (KOLs)",
//       "subtitle": null,
//       "caption": "No NCCN Panel Members",
//       "order": 5,
//       "componentPath": "./PanelMembers",
//       "parentId": "8af8f890-0a0b-4198-9240-7efe5d24666a"
//     },
//     {
//       "_id": "b67bb671-fc23-46b3-bfa6-c1f73ad1ad31",
//       "type": "card",
//       "name": "Internal Dispensing",
//       "subtitle": "Overview of accounts that have internal dispensing & support capabilities for specialty therapeutics",
//       "caption": null,
//       "order": 1,
//       "componentPath": "./InternalPharmCard",
//       "parentId": "b8a258d4-1c79-45fb-b83b-2086b28313bc"
//     },
//     {
//       "_id": "e18fcf90-9f82-4ca8-b54f-1902cedd0ded",
//       "type": "card",
//       "name": "Specialty Pharmacy Accreditation",
//       "subtitle": "Whether accounts have key pharmacy accreditations, indicating dispensing sophistication",
//       "caption": null,
//       "order": 2,
//       "componentPath": "./PharmacyAcc",
//       "parentId": "b8a258d4-1c79-45fb-b83b-2086b28313bc"
//     },
//     {
//       "_id": "f564a089-df22-41bd-b4d2-f8ca71b84a52",
//       "type": "card",
//       "name": "3rd Party & Internal Pathways",
//       "subtitle": "Summary of account participation in 3rd party or internal pathways",
//       "caption": null,
//       "order": 1,
//       "componentPath": "./InternalPartyPathways",
//       "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
//     },
//     {
//       "_id": "f4f4787a-83d2-4ba3-aedc-c10996993ee0",
//       "type": "card",
//       "name": "$var1",
//       "subtitle": "Pathways positioning of key brands vs. competitors for priority indications",
//       "caption": "No Internal or 3rd Party Pathways available at this time.",
//       "order": 2,
//       "componentPath": "./PathwaysCoverage",
//       "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
//     },
//     {
//       "_id": "85c525d9-0188-4ed0-bab8-cb81debdd7c6",
//       "type": "card",
//       "name": "Alternative Payment Model / Quality Program",
//       "subtitle": null,
//       "caption": "No APMs or Quality Programs",
//       "order": 3,
//       "componentPath": "./ApmProgram",
//       "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
//     },
//     {
//       "_id": "6c3b140a-a1e0-44d7-a333-cb1b5f1aca3f",
//       "type": "card",
//       "name": "$var1",
//       "subtitle": "Key stakeholders involved with pathways decision-making",
//       "caption": "No Pathways Influencers",
//       "order": 4,
//       "componentPath": "./PathwaysInfluencers",
//       "parentId": "bdbc71cc-87b3-4762-9567-e6db78c47148"
//     }
//   ]
// }

// const newSitemaps = [payerSitemap, providerSitemap];


