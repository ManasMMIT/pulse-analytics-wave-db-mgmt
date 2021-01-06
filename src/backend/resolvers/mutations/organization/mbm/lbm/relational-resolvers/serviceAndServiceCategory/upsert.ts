import { ObjectId } from 'mongodb'

import lbmsServicesJoinsToDevCollPipeline from '../shared/lbms-services-joins-to-dev-coll-pipeline'

const aggPipelineToMaterializeConnectionsForSingleLbm = (lbmServiceId) => [
  { $match: { lbmServiceId } },
  ...lbmsServicesJoinsToDevCollPipeline,
]

const connectLbmServiceAndLbmServiceCategory = async (
  parent,
  { input: { _id, lbmServiceId, lbmServiceCategoryId } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const isUpdating = Boolean(_id)

  _id = _id ? new ObjectId(_id) : new ObjectId()
  lbmServiceId = new ObjectId(lbmServiceId)
  lbmServiceCategoryId = new ObjectId(lbmServiceCategoryId)

  let newOrUpdatedDoc

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    newOrUpdatedDoc = await pulseCoreDb
      .collection('JOIN_lbms.services_lbms.services.categories')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            lbmServiceId,
            lbmServiceCategoryId,
          },
        },
        { upsert: true, returnOriginal: false, session }
      )
      .then(({ value }) => value)

    if (isUpdating) {
      // On an update update all category fields in lbmsServices services subdoc
      const { name: categoryName } = await pulseCoreDb
        .collection('lbms.services.categories')
        .findOne({ _id: newOrUpdatedDoc.lbmServiceCategoryId }, { session })

      await pulseDevDb.collection('lbmsServices').updateMany(
        { 'service._id': newOrUpdatedDoc.lbmServiceId },
        {
          $set: {
            'service.category': categoryName,
            'service.categoryId': newOrUpdatedDoc.lbmServiceCategoryId,
          },
        },
        { session }
      )
    } else {
      /*
        This is either the first time a service has been linked to a category,
          or a service's category was deleted and it's being re-linked.
        Either way, lbmsServices shouldn't have any docs for this lbm and service b/c of the lack of category,
          so new lbmService docs must be inserted
      */
      const aggPip = aggPipelineToMaterializeConnectionsForSingleLbm(
        newOrUpdatedDoc.lbmServiceId
      )

      const devDocsToInsert = await pulseCoreDb
        .collection('JOIN_lbms_lbms.services')
        .aggregate(aggPip, { session })
        .toArray()

      if (devDocsToInsert.length) {
        await pulseDevDb
          .collection('lbmsServices')
          .insertMany(devDocsToInsert, { session })
      }
    }
  })

  return newOrUpdatedDoc
}

export default connectLbmServiceAndLbmServiceCategory
