const {
  payerCombinationHasher
} = require('../../utils')
const _ = require('lodash')

const validateQualityOfAccess = ({ sheetData, strictlyRequiredPtps }) => {
  const hashPtps = payerCombinationHasher('ptps')
  const exactCorrectSetOfOrgTps = Object.keys(strictlyRequiredPtps)

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
      '\n#Incoming Payer Treatment Plan combos did not pass validation\n'
      + `#The following combinations were expected, but missing in the Quality of Access sheet:\n${missingOrgTpCombos}\n`
      + `#The following combinations were invalid in the Quality of Access sheet:\n${invalidOrgTpCombos}\n`
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
      '\n#Incoming Payer Treatment Plan combos did not pass validation\n'
      + `#The following combinations were duplicated in the Quality of Access sheet: ${ orgTpsThatHaveDupes }\n`
    )
  }

  return true
}

module.exports = validateQualityOfAccess
