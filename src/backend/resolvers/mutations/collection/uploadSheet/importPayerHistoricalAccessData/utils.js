const _ = require('lodash')

const isQualityAccessSheet = sheetName => /Quality of Access/.test(sheetName)

const isAdditionalCriteriaSheet = sheetName => /Additional Criteria/.test(sheetName)

const isPolicyLinksSheet = sheetName => /Policy Links/.test(sheetName)

const payerCombinationHasher = key => (datum) => {
  const keysToHash = {
    ptps: ['slug', 'indication', 'regimen', 'line', 'population', 'book', 'coverage'],
    brcs: ['slug', 'regimen','book', 'coverage'],
  }

  const hasher = []

  if (!keysToHash[key]) {
    throw new Error(`Key Does not Exist. Must be one of the following: ${ Object.keys(keysToHash) }`)
  }

  keysToHash[key].forEach(field => {
    if (datum[field]) hasher.push(datum[field])
  })

  return hasher.join('|')
}

const getValidationComboHash = (allowedOrgTpCombos, hashType) => {
  const hasher = payerCombinationHasher(hashType)
  return _.keyBy(allowedOrgTpCombos, hasher)
}

module.exports = {
  isQualityAccessSheet,
  isAdditionalCriteriaSheet,
  isPolicyLinksSheet,
  payerCombinationHasher,
  getValidationComboHash,
}
