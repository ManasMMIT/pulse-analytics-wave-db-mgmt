const _ = require('lodash')

const getIsQualityAccessSheet = sheetName => /Quality of Access/.test(sheetName)

const getIsAdditionalCriteriaSheet = sheetName => /Additional Criteria/.test(sheetName)

const getIsPolicyLinksSheet = sheetName => /Policy Links/.test(sheetName)

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

const getAllowedComboHashes = (allowedOrgTpCombos, hashType) => {
  const hasher = payerCombinationHasher(hashType)
  return _.keyBy(allowedOrgTpCombos, hasher)
}

module.exports = {
  getIsQualityAccessSheet,
  getIsAdditionalCriteriaSheet,
  getIsPolicyLinksSheet,
  payerCombinationHasher,
  getAllowedComboHashes,
}
