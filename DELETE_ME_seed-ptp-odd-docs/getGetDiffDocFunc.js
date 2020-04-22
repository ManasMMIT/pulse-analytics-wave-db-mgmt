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

  const validPtpNotches = _.keyBy(
    allowedPolicyLinkNotches,
    doc => [doc.slug, doc.month, doc.year, doc.book, doc.coverage, doc.regimen].join('|')
  )

  const newCollectionOp = pulseDevStaging
    .collection(collectionName)
    .find()
    .toArray()

  let purposefullyDeletedAndPreLastImportFilter = {
    $and: [
      {
        $nor: [
          {
            regimen: { $in: ['Dupixent', 'Cinqair', 'Nucala', 'Fasenra', 'Xolair'] },
            population: 'No Subtype Specified'
          },
          {
            regimen: 'Fasenra', population: 'Eosinophilic'
          },
          {
            indication: 'Urothelial',
            population: {
              $in: [
                'PD-L1 (CPS) Requirement',
                'Cisplatin-Ineligible',
                'PD-L1 (CPS) Requirement, Cisplatin-Ineligible',
                'PD-L1 (IC) Requirement, Cisplatin-Ineligible'
              ]
            }
          },
          {
            indication: 'Melanoma',
            population: { $in: ['BRAF V600', 'Metastatic'] }
          },
          { indication: 'NSCLC', line: '1L+', regimen: 'Keytruda' },
          { indication: 'NSCLC', line: '2L+', regimen: 'Keytruda' },
          { indication: 'SCLC', line: '2L+', regimen: 'Keytruda' },
          { indication: 'ALL', line: '3L+' }, // 1 doc
        ]
      },
      {
        createdOn: {
          $lt: new Date('2020-04-09T15:00:00.000Z')
        }
      }
    ]
  }

  if (collectionName.includes('PolicyLink')) {
    purposefullyDeletedAndPreLastImportFilter = {
      createdOn: {
        $lt: new Date('2020-04-09T15:00:00.000Z')
      }
    }
  }

  const oldCollectionOp = pulseDevControl
    .collection(collectionName)
    .find(purposefullyDeletedAndPreLastImportFilter)
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

      const isNotchValid = validPtpNotches[
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
