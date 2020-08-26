const _ = require('lodash')

const getDestinationDupes = async (destDef, sourceId, mongoCtx) => {
  return mongoCtx.mongoConnection
    .db(destDef.db)
    .collection(destDef.collection)
    .find({ [`${destDef.field}._id`]: sourceId }, mongoCtx.mongoOpts)
    .toArray()
    .then((destDocs) => destDocs.map((destDoc) => destDoc[destDef.field]))
}

const duplicationIsValid = async (policy, sourceId, mongoCtx) => {
  const source = await mongoCtx.mongoConnection
    .db(policy.source.db)
    .collection(policy.source.collection)
    .findOne({ _id: sourceId }, mongoCtx.mongoOpts)

  const matchesSource = (destDoc) => _.isEqual(destDoc, source)

  return _(policy.destinations)
    .map(async (destinationDef) => {
      const destinationDupes = await getDestinationDupes(destinationDef)
      return destinationDupes.every(matchesSource)
    })
    .thru((p) => Promise.all(p))
    .value()
    .then((collectionPassedFlags) => _.every(collectionPassedFlags))
}

module.exports = {
  duplicationIsValid,
  getDestinationDupes,
}
