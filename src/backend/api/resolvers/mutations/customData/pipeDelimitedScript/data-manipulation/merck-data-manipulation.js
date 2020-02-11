const { usePlaceholderIfNeeded, livesFilterToKey, medicareToMedicareAdvantage  } = require('../util')
const getVal = require('../get-val-from-keychain')
// const MERCK_KEYTRUDA_MARKET = 'Immuno Oncology'

// Map project field from payerHistoricalQualityAccess to corresponding market
const PROJECT_TO_MARKET_MAP = {
  'Merck Keytruda': 'Immuno Oncology',
  'Merck Biosimilars': 'Biosimilars'
}

const getMerckMapCallback = (payerNationalLivesData) => qoaObj => {
  const {
    regimen,
    slug,
    organization,
    book,
    coverage,
    indication,
    line,
    population,
    subPopulation,
    access,
    policyDate,
    reviewDate,
    project
  } = qoaObj

  const drgParentId = usePlaceholderIfNeeded(
    getVal(payerNationalLivesData, [slug, 'drgParentId'])
  )
  const livesKey = livesFilterToKey(`${book} ${coverage}`)
  const lives = usePlaceholderIfNeeded(
    getVal(payerNationalLivesData, [slug, livesKey])
  )

  let accessCategory = `${indication} ${line}`

  if (population && population !== 'No Subtype Specified') {
    accessCategory += `: ${population}`

    if (subPopulation) {
      accessCategory += `: ${subPopulation}`
    }
  }

  const result = {
    Market: PROJECT_TO_MARKET_MAP[project],
    Product: regimen,
    'DRG Parent ID': drgParentId,
    'Payer': organization,
    'Payer Channel': medicareToMedicareAdvantage(book),
    // 'Coverage': coverage,
    'Medical Lives': lives,
    'Access Category': accessCategory,
    // 'Patient Subtype': usePlaceholderIfNeeded(population),
    // 'Patient Subpopulation': usePlaceholderIfNeeded(subPopulation),
    'Access': access,
    'Policy Date': usePlaceholderIfNeeded(policyDate),
    'Review Date': usePlaceholderIfNeeded(reviewDate)
  }

  return result
}

const merckDataManipulation = (payerNationalLivesData, merckProjectsData) => {
  const { merckKeytrudaData } = merckProjectsData
  const merckKeytrudaMapCallback = getMerckMapCallback(payerNationalLivesData)

  const formattedMerckKeytrudaData = merckKeytrudaData.map(merckKeytrudaMapCallback)

  return {
    formattedMerckKeytrudaData
  }
}

module.exports = merckDataManipulation
