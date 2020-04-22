const _ = require('lodash')

const Base = require('./Base')
const {
  getProjectOrgTpsEnrichedPipeline,
} = require('./agg-pipelines')

class Validation extends Base {
  async getAllowedPtpsHash(hasher) {
    const allowedOrgTpCombos = await this.pulseCore
      .collection('tdgProjects')
      .aggregate(
        getProjectOrgTpsEnrichedPipeline(this.projectId)
      )
      .toArray()

    return _.keyBy(
      allowedOrgTpCombos,
      hasher,
    )
  }

  async validateQualityOfAccess(sheetData) {
    const {
      hashPtps,
      getAllowedPtpsHash,
    } = this

    const allowedPtps = await getAllowedPtpsHash.call(this, hashPtps)

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
        + `The following combinations were duplicated: ${orgTpsThatHaveDupes}\n`
      )
    }
  }

  async validateAdditionalCriteria(sheetData) {
    const {
      hashPtps,
      getAllowedPtpsHash,
    } = this

    const allowedPtps = await getAllowedPtpsHash.call(this, hashPtps)

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
        + `The following combinations were invalid:\n${invalidOrgTpCombos}\n`
      )
    }
  }

  async validatePolicyLinks(sheetData) {
    const {
      hashBrcs,
      getAllowedPtpsHash,
    } = this

    const allowedBrcs = await getAllowedPtpsHash.call(this, hashBrcs)

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
  }
}

module.exports = Validation
