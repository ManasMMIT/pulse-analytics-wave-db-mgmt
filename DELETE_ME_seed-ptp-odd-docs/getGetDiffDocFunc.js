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
  dbs: {
    pulseDevStaging,
    pulseDevTest,
  },
}) => async ({
  comparer,
  collectionName,
}) => {
  const newCollectionOp = pulseDevStaging
    .collection(collectionName)
    .find()
    .toArray()

  const oldCollectionOp = pulseDevTest
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

  oldCollectionDocs = oldCollectionDocs.filter(({ 
    slug,
    indication,
    regimen,
    line,
    population,
    book,
    coverage,
  }) => {
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

    if (collectionName === 'payerHistoricalPolicyLinks') return comboIsValid

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
