const _ = require('lodash')
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
  {
    policy, // : DuplicationPolicy
    mockSourceDatum, //
    mockDestinationData, // {[dbName: string]: {[collName: string]: object[]}}
  },
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

module.exports = {
  mockDuplication,
  mockHydrateSource,
  mockHydrateDestination,
}
