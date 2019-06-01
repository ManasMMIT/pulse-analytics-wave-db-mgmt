const _ = require('lodash')

const pagesCardsMapRaw = {
  provider_management_regionalFootprint: [
    {
      name: 'Site Locations',
    },
    {
      name: 'Site of Care Mix',
    },
  ],
  provider_management_internalPharmacy: [
    {
      name: 'Internal Dispensing',
    },
    {
      name: 'Specialty Pharmacy Accreditation',
    },
  ],
  provider_management_pathways: [
    {
      name: 'Pathways',
    },
    {
      name: '3rd Party Pathways',
    },
    {
      name: '3rd Party & Internal Pathways Integration',
    },
    {
      name: '3rd Party & Internal Pathways Policing Mechanisms',
    },
  ],
  provider_management_alternativePaymentModels: [
    {
      name: 'Alternative Payment Model Breakdown',
    },
  ],
  provider_accounts_businessModelCapabilities: [
    {
      name: 'Staffing',
    },
    {
      name: 'Annual Patient Volume by Indication',
    },
    {
      name: 'Payer Mix',
    },
    {
      name: 'Operational Infrastructure',
    },
    {
      name: 'M&A, Affiliations, Academic Partnerships',
    },
  ],
  provider_accounts_clinicalSophistication: [
    {
      name: 'Clinical Designations',
    },
    {
      name: 'Clinical Trials Volume',
    },
    {
      name: 'Precision Medicine',
    },
    {
      name: 'NCCN Panel Members (KOLs)',
    },
  ],
  provider_accounts_valueBasedCare: [
    {
      name: '3rd Party & Internal Pathways',
    },
    {
      name: 'Internal Pathways: $var1',
    },
    {
      name: 'Alternative Payment Model / Quality Program',
    },
    {
      name: 'Internal Pathways Influencers',
    },
  ],
  provider_accounts_manufacturerEngagement: [
    {
      name: 'Valued Data Sources & Education Resources',
    },
    {
      name: 'Manufacturer Engagement',
    },
    {
      name: 'Key Decision Makers',
    },
  ],
  // payers_management_summary: [

  // ],
  // payers_management_qualityOfAccess: [

  // ],
  // payers_management_dupixentRelativeAccess: [

  // ],
  // payers_management_competitiveAccess: [

  // ],
  // payers_management_reviewTiming: [

  // ],
  // payers_management_treatmentCenters: [

  // ],
  // payers_management_regionalTargeting: [

  // ],
  // payers_management_valueBasedModels: [

  // ],
  // payers_management_strategicAccounts: [

  // ],
  // payers_management_reports: [

  // ],
  // payers_accounts_summaryEngagement: [

  // ],
  // payers_accounts_overview: [

  // ],
  // payers_accounts_managementCapabilities: [

  // ],
  // payers_accounts_reviewProcess: [

  // ],
  // payers_accounts_productCoverage: [

  // ],
}

const PAGE_CARD_MAP = _.reduce(pagesCardsMapRaw, (acc, arrOfCardsData, key) => {
  acc[key] = arrOfCardsData.map((obj, i) => {
    return { type: 'card', order: i + 1, ...obj }
  })

  return acc
}, {})

module.exports = PAGE_CARD_MAP
