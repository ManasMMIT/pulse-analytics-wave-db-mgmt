const { ObjectId } = require('mongodb')

const obmsServicesJoinsToDevCollPipeline = require('./../shared/obms-services-joins-to-dev-coll-pipeline')

const connectObmServiceAndObmServiceCategory = async (
  parent,
  { input: { _id, obmServiceId, obmServiceCategoryId } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const isUpdating = Boolean(_id)

  _id = _id ? ObjectId(_id) : ObjectId()
  obmServiceId = ObjectId(obmServiceId)
  obmServiceCategoryId = ObjectId(obmServiceCategoryId)

  let newOrUpdatedDoc

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    newOrUpdatedDoc = await pulseCoreDb
      .collection('JOIN_obms.services_obms.services.categories')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            _id,
            obmServiceId,
            obmServiceCategoryId,
          },
        },
        { upsert: true, returnOriginal: false, session }
      )
      .then(({ value }) => value)

    if (isUpdating) {
      // On an update update all category fields in obmsServices services subdoc
      const { name: categoryName } = await pulseCoreDb
        .collection('obms.services.categories')
        .findOne({ _id: newOrUpdatedDoc.obmServiceCategoryId }, { session })

      await pulseDevDb.collection('obmsServices').updateMany(
        { 'service._id': newOrUpdatedDoc.obmServiceId },
        {
          $set: {
            'service.category': categoryName,
            'service.categoryId': newOrUpdatedDoc.obmServiceCategoryId,
          },
        },
        { session }
      )
    } else {
      /*
        This is either the first time a service has been linked to a category,
          or a service's category was deleted and it's being re-linked.
        Either way, obmsServices shouldn't have any docs for this obm and service b/c of the lack of category,
          so new obmService docs must be inserted
      */
      const aggPip = aggPipelineToMaterializeConnectionsForSingleObm(
        newOrUpdatedDoc.obmServiceId
      )

      const devDocsToInsert = await pulseCoreDb
        .collection('JOIN_obms_obms.services')
        .aggregate(aggPip, { session })
        .toArray()

      if (devDocsToInsert.length) {
        await pulseDevDb
          .collection('obmsServices')
          .insertMany(devDocsToInsert, { session })
      }
    }
  })

  return newOrUpdatedDoc
}

module.exports = connectObmServiceAndObmServiceCategory

const aggPipelineToMaterializeConnectionsForSingleObm = (obmServiceId) => [
  { $match: { obmServiceId } },
  ...obmsServicesJoinsToDevCollPipeline,
]
