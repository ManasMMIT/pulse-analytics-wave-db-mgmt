const _ = require('lodash')
const { ObjectId } = require('mongodb')

const obmsServicesJoinsToDevCollPipeline = require('./../shared/obms-services-joins-to-dev-coll-pipeline')

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many services
const connectObmAndObmService = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  // Note: Error out if input is blank arr; otherwise we could get
  // unexpected result where someone clears all services and op seems successful
  // but nothing in DB gets deleted (cuz there's no obmId to target for the deleteMany)
  if (_.isEmpty(input)) throw new Error("Can't save empty connections")

  const session = mongoClient.startSession()

  const coreDocsToInsert = input.map(
    ({ _id, obmServiceId, obmId, rating }) => ({
      _id: _id ? ObjectId(_id) : ObjectId(),
      obmServiceId: ObjectId(obmServiceId),
      obmId: ObjectId(obmId),
      rating: Number(rating),
    })
  )

  const obmId = coreDocsToInsert[0].obmId

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given obm
    // with the incoming entries in core JOIN_obms_obms.services
    await pulseCoreDb
      .collection('JOIN_obms_obms.services')
      .deleteMany({ obmId }, { session })

    await pulseCoreDb
      .collection('JOIN_obms_obms.services')
      .insertMany(coreDocsToInsert, { session })

    // Step 2: replace all existing entries affiliated with given obm
    // with the incoming entries in dev obmsServices
    await pulseDevDb
      .collection('obmsServices')
      .deleteMany({ 'obm._id': obmId }, { session })

    const devDocsToInsert = await pulseCoreDb
      .collection('JOIN_obms_obms.services')
      .aggregate(aggPipelineToMaterializeConnectionsForSingleObm(obmId), {
        allowDiskUse: true,
        session,
      })
      .toArray()

    if (!_.isEmpty(devDocsToInsert)) {
      await pulseDevDb
        .collection('obmsServices')
        .insertMany(devDocsToInsert, { session })
    }
  })

  return coreDocsToInsert
}

module.exports = connectObmAndObmService

const aggPipelineToMaterializeConnectionsForSingleObm = (obmId) => [
  { $match: { obmId } },
  ...obmsServicesJoinsToDevCollPipeline,
]
