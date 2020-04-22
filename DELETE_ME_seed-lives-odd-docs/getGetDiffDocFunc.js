const _ = require('lodash')

module.exports = async (pulseCoreDb) => {
  const payerOrgs = await pulseCoreDb
    .collection('organizations')
    .find({ type: 'Payer' }).toArray()

  const payersBySlug = _.keyBy(
    payerOrgs,
    'slug',
  )

  return async ({
    db,
    comparer,
    collectionName,
  }) => {
    const newCollectionOp = db
      .collection(`${collectionName}-MATT`)
      .find()
      .toArray()

    const oldCollectionOp = db
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

    if (oldCollectionDocs[0].slug) {
      oldCollectionDocs = oldCollectionDocs
        .filter(({ slug }) => payersBySlug[slug])
    }

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

}
