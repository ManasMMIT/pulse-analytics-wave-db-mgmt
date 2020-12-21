import { ObjectId } from 'mongodb'

const connectLbmAndLbmType = async (
  parent,
  { input: { _id, lbmId, lbmTypeId } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = _id ? new ObjectId(_id) : new ObjectId()
  lbmId = new ObjectId(lbmId)
  lbmTypeId = new ObjectId(lbmTypeId)

  let newOrUpdatedDoc

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    newOrUpdatedDoc = await pulseCoreDb
      .collection('JOIN_lbms_lbms.types')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            _id,
            lbmId,
            lbmTypeId,
          },
        },
        { upsert: true, returnOriginal: false, session }
      )
      .then(({ value }) => value)

    const typeData = await pulseCoreDb.collection('lbms.types').findOne({
      _id: newOrUpdatedDoc.lbmTypeId,
    })

    await pulseDevDb.collection('lbms').updateOne(
      { _id: newOrUpdatedDoc.lbmId },
      {
        $set: {
          type: typeData,
        },
      },
      { session }
    )

    await pulseDevDb
      .collection('lbmsPayers')
      .updateMany(
        { 'lbm._id': newOrUpdatedDoc.lbmId },
        { $set: { 'lbm.type': typeData } },
        { session }
      )
  })

  return newOrUpdatedDoc
}

export default connectLbmAndLbmType
