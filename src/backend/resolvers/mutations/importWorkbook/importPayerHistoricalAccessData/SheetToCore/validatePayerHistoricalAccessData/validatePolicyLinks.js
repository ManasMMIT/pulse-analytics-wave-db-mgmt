const {
  payerCombinationHasher
} = require('../../utils')
const _ = require('lodash')

const validatePolicyLinks = ({ sheetData, allowedBrcs }) => {
  const hashBrcs = payerCombinationHasher('brcs')
  const exactCorrectSetOfBrcs = Object.keys(allowedBrcs)

  const sheetBrcsGroupedByBrcs = _.groupBy(sheetData, hashBrcs)

  const allSheetBrcs = Object.keys(sheetBrcsGroupedByBrcs)

  const dupeBrcs = Object.entries(sheetBrcsGroupedByBrcs).reduce((acc, [key, values]) => {
    if (values.length > 1) acc.push(key)

    return acc
  }, [])
  .join('\n')

  if (dupeBrcs.length) {
    throw new Error(
      'Incoming Book, Regimen, Coverage, and Slug combos did not pass validation\n'
      + `The following combinations were duplicate:\n${dupeBrcs}\n`
    )
  }

  // only validating that we have at least a subset of valid PTPs
  const invalidBrcs = _.difference(
    allSheetBrcs,
    exactCorrectSetOfBrcs,
  ).join('\n')

  if (invalidBrcs.length) {
    throw new Error(
      'Incoming Book, Regimen, Coverage, and Slug combos did not pass validation\n'
      + `The following combinations were invalid:\n${invalidBrcs}\n`
    )
  }

  return true
}

module.exports = validatePolicyLinks
