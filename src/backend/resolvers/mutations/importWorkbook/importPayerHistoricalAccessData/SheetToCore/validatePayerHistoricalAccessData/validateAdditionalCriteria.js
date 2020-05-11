const {
  payerCombinationHasher
} = require('../../utils')
const _ = require('lodash')

const validateAdditionalCriteria = ({ sheetData, allowedPtps }) => {
  const hashPtps = payerCombinationHasher('ptps')
  const exactCorrectSetOfOrgTps = Object.keys(allowedPtps)

  // ! Note: We're only validating the unique set of PTPs in Additional Criteria
  // because PTPs are expected to be associated with one or more criteria.
  const uniqueSheetDataHashes = Object.keys(
    _.keyBy(
      sheetData,
      hashPtps,
    )
  )

  // only validating that we have at least a subset of valid PTPs
  const invalidOrgTpCombos = _.difference(
    uniqueSheetDataHashes,
    exactCorrectSetOfOrgTps,
  ).join('\n')

  if (invalidOrgTpCombos.length) {
    throw new Error(
      'Incoming Payer Treatment Plan combos did not pass validation\n'
      + `The following combinations were invalid:\n${ invalidOrgTpCombos }\n`
    )
  }

  return true
}

module.exports = validateAdditionalCriteria
