const _ = require('lodash')

module.exports = ({
  validSlugs,
  invalidSlugs,
  validIndications,
  invalidIndications,
  validRegimens,
  invalidRegimens,
  validLines,
  invalidLines,
  validPopulations,
  invalidPopulations,
  validBooks,
  invalidBooks,
  validCoverages,
  invalidCoverages,
  treatmentPlans,
  allowedPolicyLinkNotches,
  allowedPtpNotches,
  dbs: {
    pulseDevStaging,
    pulseDevControl,
  },
}) => async ({
  comparer,
  collectionName,
}) => {
  const tpHash = collectionName.includes('Policy')
    ? ({ book, coverage, regimen}) => [book, coverage, regimen].join('|')
    : ({ book, coverage, regimen, indication, population, line }) => [book, coverage, regimen, indication, population, line].join('|')

  const validTps = _.groupBy(treatmentPlans, tpHash)

  const validBrcsNotches = _.keyBy(
    allowedPolicyLinkNotches,
    doc => [doc.slug, doc.month, doc.year, doc.book, doc.coverage, doc.regimen].join('|')
  )

  const validPtpNotches = _.keyBy(
    allowedPtpNotches,
    doc => [doc.slug, doc.month, doc.year, doc.book, doc.coverage, doc.regimen, doc.indication, doc.population, doc.line].join('|')
  )

  const newCollectionOp = pulseDevStaging
    .collection(collectionName)
    .find()
    .toArray()

  const oldCollectionOp = pulseDevControl
    .collection(collectionName)
    .find()
    .toArray()

  console.log(`Comparing ${collectionName} docs`)

  let [
    newCollectionDocs,
    oldCollectionDocs,
  ] = await Promise.all([
    newCollectionOp,
    oldCollectionOp,
  ])

  // ! don't care about purposefully excluded docs b/c invalid parts

  oldCollectionDocs = oldCollectionDocs.filter(({
    slug,
    indication,
    regimen,
    line,
    population,
    book,
    coverage,
    criteria,
    month,
    year,
  }) => {
    if (collectionName.includes('AdditionalCriteria')) {
      if (!criteria) return false

      const isPtpNotchValid = validPtpNotches[
        [slug, month, year, book, coverage, regimen, indication, population, line].join('|')
      ]

      if (!isPtpNotchValid) {
        return false
      }
    }

    let comboIsValid = true

    const isSlugValid = validSlugs[slug]
    if (!isSlugValid) {
      invalidSlugs[slug] = true
      comboIsValid = false
    }

    const isRegimenValid = validRegimens[regimen]
    if (!isRegimenValid) {
      invalidRegimens[regimen] = true
      comboIsValid = false
    }

    const isBookValid = validBooks[book]
    if (!isBookValid) {
      invalidBooks[book] = true
      comboIsValid = false
    }

    const isCoverageValid = validCoverages[coverage]
    if (!isCoverageValid) {
      invalidCoverages[coverage] = true
      comboIsValid = false
    }

    if (
      collectionName === 'payerHistoricalPolicyLinks'
        || collectionName === 'payerHistoricalPolicyLinksHt'
    ) {
      const isValidTp = validTps[
        [book, coverage, regimen].join('|')
      ]

      if (!isValidTp) {
        comboIsValid = false
      }

      const isNotchValid = validBrcsNotches[
        [slug, month, year, book, coverage, regimen].join('|')
      ]

      if (!isNotchValid) {
        comboIsValid = false
      }

      return comboIsValid
    }

    const isIndicationValid = validIndications[indication]
    if (!isIndicationValid) {
      invalidIndications[indication] = true
      comboIsValid = false
    }

    const isPopulationValid = validPopulations[population]
    if (!isPopulationValid) {
      invalidPopulations[population] = true
      comboIsValid = false
    }

    const isLineValid = validLines[line]
    if (!isLineValid) {
      invalidLines[line] = true
      comboIsValid = false
    }

    const isTpValid = validTps[
      [book, coverage, regimen, indication, population, line].join('|')
    ]

    if (!isTpValid) {
      comboIsValid = false
    }

    return comboIsValid
  })

  const inOldNotNew = _.differenceBy(
    oldCollectionDocs,
    newCollectionDocs,
    comparer,
  )

  const inNewNotOld = _.differenceBy(
    newCollectionDocs,
    oldCollectionDocs,
    comparer,
  )

  const inBothNewAndOld = _.intersectionBy(
    oldCollectionDocs,
    newCollectionDocs,
    comparer,
  )

  console.log(`FINISHED Comparing ${collectionName} docs`)

  console.log(collectionName + ': ' + 'Total diff...in old not new: ' + inOldNotNew.length)
  console.log(collectionName + ': ' + 'Total diff...in new not old: ' + inNewNotOld.length)
  console.log(collectionName + ': ' + 'Total diff...in both new and old: ' + inBothNewAndOld.length)

  return {
    simpleDiff: {
      collection: collectionName,
      'In old, not new': inOldNotNew[0],
      'In new, not old': inNewNotOld[0],
      'In both': inBothNewAndOld[0],
    },
    diff: {
      collection: collectionName,
      // ! slices required to not bust buffer limit
      'In old, not new': inOldNotNew.slice(0, 500),
      'In new, not old': inNewNotOld.slice(0, 500),
      'In both': inBothNewAndOld.slice(0, 500),
    },
  }
}
