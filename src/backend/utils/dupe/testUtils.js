const _ = require('lodash')
// utilies for testing duped entities
const mockHydrateSource = async (
  policy,
  mockDatum, // : object
  mongoCtx
) =>
  mongoCtx.mongoConnection
    .db(policy.source.db)
    .collection(policy.source.collection)
    .insertOne(mockDatum, mongoCtx.mongoOpts)

const mockHydrateDestination = async (
  policyDestination,
  mockDatums,
  mongoCtx
) =>
  mongoCtx.mongoConnection
    .db(policyDestination.db)
    .collection(policyDestination.collection)
    .insertMany(mockDatums, mongoCtx.mongoOpts)

const mockDuplication = async (
  policy, // : DuplicationPolicy
  mockSourceDatum, //
  mockDestinationData, // {[dbName: string]: {[collName: string]: object[]}}
  mongoCtx
) => {
  await mockHydrateSource(policy, mockSourceDatum, mongoCtx)
  await _(policy.destinations)
    .map((destinationDef) =>
      mockHydrateDestination(
        destinationDef,
        mockDestinationData[destinationDef.db][destinationDef.collection],
        mongoCtx
      )
    )
    .thru((p) => Promise.all(p))
    .value()
}

const getDestinationDupes = async (destDef, sourceId, mongoCtx) =>
  mongoCtx.mongoConnection
    .db(destDef.db)
    .collection(destDef.collection)
    .find({ [`${destDef.field}._id`]: sourceId }, mongoCtx.mongoOpts)
    .toArray()
    .then((destDocs) => destDocs.map((destDoc) => destDoc[destDef.field]))

const isInSync = async (policy, sourceId, mongoCtx) => {
  let source = await mongoCtx.mongoConnection
    .db(policy.source.db)
    .collection(policy.source.collection)
    .findOne({ _id: sourceId }, mongoCtx.mongoOpts)

  let matchesSource = (destDoc) => _.isEqual(destDoc, source)

  return _(policy.destinations)
    .map(async (destDef) =>
      (await getDestinationDupes(destinationDef)).every(matchesSource)
    )
    .thru((p) => Promise.all(p))
    .value()
    .then((collectionPassedFlags) => _.every(collectionPassedFlags))
}

module.exports = {
  isInSync,
  mockDuplication,
  getDestinationDupes,
}
