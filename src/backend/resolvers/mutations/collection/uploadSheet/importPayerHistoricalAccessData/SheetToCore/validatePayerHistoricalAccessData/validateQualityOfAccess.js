const {
  payerCombinationHasher
} = require('../../utils')
const _ = require('lodash')

const validateQuaityOfAccess = ({ sheetData, allowedPtps }) => {
  const hashPtps = payerCombinationHasher('ptps')
  const exactCorrectSetOfOrgTps = Object.keys(allowedPtps)

  const sheetDataHashes = sheetData.map(hashPtps)
  const missingOrgTpCombos = _.difference(
    exactCorrectSetOfOrgTps,
    sheetDataHashes,
  ).join('\n')

  const invalidOrgTpCombos = _.difference(
    sheetDataHashes,
    exactCorrectSetOfOrgTps,
  ).join('\n')

  if (missingOrgTpCombos.length || invalidOrgTpCombos.length) {
    throw new Error(
      'Incoming Payer Treatment Plan combos did not pass validation\n'
      + `The following combinations were expected, but missing:\n${missingOrgTpCombos}\n`
      + `The following combinations were invalid:\n${invalidOrgTpCombos}\n`
    )
  }

  // ! Still possible at this point that all orgTps in received are valid but
  // ! there are dupes in them, which requires us to error
  if (sheetDataHashes.length !== exactCorrectSetOfOrgTps.length) {
    const hash = {}
    const orgTpsThatHaveDupes = []

    for (const str of sheetDataHashes) {
      if (hash[str]) {
        hash[str]++
      } else {
        hash[str] = 1
      }

      if (hash[str] === 2) orgTpsThatHaveDupes.push(str)
    }

    throw new Error(
      'Incoming Payer Treatment Plan combos did not pass validation\n'
      + `The following combinations were duplicated: ${ orgTpsThatHaveDupes }\n`
    )
  }

  return true
}

module.exports = validateQuaityOfAccess
