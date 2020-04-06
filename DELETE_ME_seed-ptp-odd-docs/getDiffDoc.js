const _ = require('lodash')

module.exports = async ({
  dbs: {
    pulseDevStaging,
    pulseDevTest,
  },
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

  const [
    newCollectionDocs,
    oldCollectionDocs,
  ] = await Promise.all([
    newCollectionOp,
    oldCollectionOp,
  ])

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
