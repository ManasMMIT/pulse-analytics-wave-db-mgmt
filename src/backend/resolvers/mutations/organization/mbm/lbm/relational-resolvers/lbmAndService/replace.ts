import _ from 'lodash'
import { ObjectId } from 'mongodb'

import lbmsServicesJoinsToDevCollPipeline from './../shared/lbms-services-joins-to-dev-coll-pipeline'

const aggPipelineToMaterializeConnectionsForSingleLbm = (lbmId) => [
  { $match: { lbmId } },
  ...lbmsServicesJoinsToDevCollPipeline,
]

// ! ASSUMPTION: this resolver is for connecting a SINGLE LBM to many services
const connectLbmAndLbmService = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  // Note: Error out if input is blank arr; otherwise we could get
  // unexpected result where someone clears all services and op seems successful
  // but nothing in DB gets deleted (cuz there's no lbmId to target for the deleteMany)
  if (_.isEmpty(input)) throw new Error("Can't save empty connections")

  const session = mongoClient.startSession()

  const coreDocsToInsert = input.map(
    ({ _id, lbmServiceId, lbmId, rating }) => ({
      _id: _id ? new ObjectId(_id) : new ObjectId(),
      lbmServiceId: new ObjectId(lbmServiceId),
      lbmId: new ObjectId(lbmId),
      rating: Number(rating),
    })
  )

  const lbmId = coreDocsToInsert[0].lbmId

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given lbm
    // with the incoming entries in core JOIN_lbms_lbms.services
    await pulseCoreDb
      .collection('JOIN_lbms_lbms.services')
      .deleteMany({ lbmId }, { session })

    await pulseCoreDb
      .collection('JOIN_lbms_lbms.services')
      .insertMany(coreDocsToInsert, { session })

    // Step 2: replace all existing entries affiliated with given lbm
    // with the incoming entries in dev lbmsServices
    await pulseDevDb
      .collection('lbmsServices')
      .deleteMany({ 'lbm._id': lbmId }, { session })

    const devDocsToInsert = await pulseCoreDb
      .collection('JOIN_lbms_lbms.services')
      .aggregate(aggPipelineToMaterializeConnectionsForSingleLbm(lbmId), {
        allowDiskUse: true,
        session,
      })
      .toArray()

    if (!_.isEmpty(devDocsToInsert)) {
      await pulseDevDb
        .collection('lbmsServices')
        .insertMany(devDocsToInsert, { session })
    }
  })

  return coreDocsToInsert
}

export default connectLbmAndLbmService
