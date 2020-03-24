const _ = require('lodash')

module.exports = async ({
  db: pulseDev,
  comparer,
  oldCollectionName,
  newCollectionName,
}) => {
  const newCollectionOp = pulseDev
    .collection(newCollectionName)
    .find()
    .toArray()

  const oldCollectionOp = pulseDev
    .collection(oldCollectionName)
    .find()
    .toArray()

  console.log(`Comparing ${oldCollectionName} vs. ${ newCollectionName } docs`)

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

  console.log(`FINISHED Comparing ${ oldCollectionName } vs. ${ newCollectionName } docs`)

  return {
    simpleDiff: {
      collection: oldCollectionName,
      'In old, not new':inOldNotNew[0],
      'In new, not old':inNewNotOld[0],
      'In both':inBothNewAndOld[0],
    },
    diff: {
      collection: oldCollectionName,
      // ! slices required to not bust buffer limit
      'In old, not new': inOldNotNew.slice(0, 500),
      'In new, not old': inNewNotOld.slice(0, 500),
      'In both': inBothNewAndOld.slice(0, 500),
    },
  }
}
