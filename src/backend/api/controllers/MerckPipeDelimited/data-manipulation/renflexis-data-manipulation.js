const { livesFilterToKey, usePlaceholderIfNeeded, medicareToMedicareAdvantage } = require('../utils')
const getVal = require('./get-val-from-keychain')

const renflexisDataManipulation = (nationalLivesData, renflexisData) => {
  const productKeysToName = [
    { key: 'relativeAccessGi', name: 'Renflexis v. Remicade - GI' },
    { key: 'relativeAccessRheum', name: 'Renflexis v. Remicade - Rheum' },
    { key: 'relativeAccessInflectraGi', name: 'Renflexis v. Inflectra - GI'},
    { key: 'relativeAccessInflectraRheum', name: 'Renflexis v. Inflectra - Rheum'},
    { key: 'relativeAccessRenflexisRemicadeInflectraRheum', name: 'Renflexis v. Remicade & Inflectra - Rheum'},
    { key: 'renflexisAccess', name: 'Renflexis v. Remicade' },
    { key: 'inflectraAccess', name: 'Inflectra v. Remicade' }
  ]

  const result = []

  renflexisData.forEach(access => {
    const {
      slug, organization, book, coverage, policyDate, reviewDate
    } = access

    const drgParentId = usePlaceholderIfNeeded(
      getVal(nationalLivesData, [slug, 'drgParentId'])
    )
    const livesKey = livesFilterToKey(`${book} ${coverage}`)
    const lives = usePlaceholderIfNeeded(
      getVal(nationalLivesData, [slug, livesKey])
    )

    const outputToInputKeys = {
      'Market': 'Infliximab',
      'DRG Parent ID': drgParentId,
      Payer: organization,
      'Payer Channel': medicareToMedicareAdvantage(book),
      // 'Coverage': coverage,
      'Policy Date': usePlaceholderIfNeeded(policyDate),
      'Review Date': usePlaceholderIfNeeded(reviewDate),
      // 'Patient Subtype': usePlaceholderIfNeeded(null),
      'Medical Lives': lives,
      // 'Patient Subpopulation': usePlaceholderIfNeeded(null),
    }

    productKeysToName.forEach(({ key, name }) => {
      if(!access[key]) return

      const additionalOutputKeys = {
        Product: name.includes('Inflectra') ? 'Inflectra' : 'Renflexis',
        'Access Category': name,
        'Access': access[key]
      }

      const totalOutput = Object.assign(additionalOutputKeys, outputToInputKeys)

      result.push(totalOutput)
    })
  })

  return result
}


module.exports = renflexisDataManipulation
