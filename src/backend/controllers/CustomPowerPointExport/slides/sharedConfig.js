const SHARED_ACCESS_MAP = {
  'PA to Label': {
    commonAccess: 'Favorable / to Label',
    chartColor: '#B2DF41',
    tableColor: '#BEE0B4',
  },
  'PA Required; Criteria Unavailable': {
    commonAccess: 'Favorable / to Label',
    chartColor: '#B2DF41',
    tableColor: '#BEE0B4',
  },
  'No Formal Policy': {
    commonAccess: 'Favorable / to Label',
    chartColor: '#B2DF41',
    tableColor: '#BEE0B4',
  },
  'No PA Required': {
    commonAccess: 'Favorable / to Label',
    chartColor: '#B2DF41',
    tableColor: '#BEE0B4',
  },
  'More Restrictive UM': {
    commonAccess: 'More Restrictive UM',
    chartColor: '#FFC60B',
    tableColor: '#FFE699',
  },
  'Not Covered': {
    commonAccess: 'Not Covered',
    chartColor: '#C00000',
    tableColor: '#C00000',
  },
  'Not Reviewed': {
    commonAccess: 'Unknown / Undecided',
    chartColor: '#AEAAAA',
    tableColor: '#C00000',
  },
  'Not Tracked': {
    commonAccess: 'Not Tracked',
    chartColor: '#AEAAAA',
    tableColor: '#C00000',
  },
  'Not Audited': {
    commonAccess: 'Not Audited',
    chartColor: '#D9D9D9',
    tableColor: '#D9D9D9',
  },
}

const DUPIXENT_REGIMEN = 'Dupixent'

const ASTHMA_INDICATION = 'Asthma'
const ATOPIC_DERMATITIS_INDICATION = 'Atopic Dermatitis'
const NASAL_POLYPS_INDICATION = 'Nasal Polyps'

const EOS_POPULATION = 'Eosinophilic'
const CORTICOSTEROID_POPULATION = 'Corticosteroid-Dependent'
const AGES_TWELVE_PLUS_POPULATION = 'Ages 12+'
const AGES_SIX_ELEVEN_POPULATION = 'Ages 6-11'
const ADULT_POPULATION = 'Adult'
const PEDIATRIC_POPULATION = 'Pediatric'

const REGENERON_USER_ID = 'auth0|5b9ff1526a52865dc2e5c789'
const PAYER_ACCOUNTS_TOOL_ID = '25fde1b5-4c24-4d8a-ad89-aa4afaca4c52'

module.exports = {
  SHARED_ACCESS_MAP,
  DUPIXENT_REGIMEN,
  ASTHMA_INDICATION,
  ATOPIC_DERMATITIS_INDICATION,
  NASAL_POLYPS_INDICATION,
  EOS_POPULATION,
  CORTICOSTEROID_POPULATION,
  ADULT_POPULATION,
  PEDIATRIC_POPULATION,
  AGES_TWELVE_PLUS_POPULATION,
  AGES_SIX_ELEVEN_POPULATION,
  REGENERON_USER_ID,
  PAYER_ACCOUNTS_TOOL_ID,
}
