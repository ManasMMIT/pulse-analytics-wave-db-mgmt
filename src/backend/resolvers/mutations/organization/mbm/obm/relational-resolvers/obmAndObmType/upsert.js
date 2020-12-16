const { ObjectId } = require('mongodb')

const connectObmAndObmType = async (
  parent,
  { input: { _id, obmId, obmTypeId } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = _id ? ObjectId(_id) : ObjectId()
  obmId = ObjectId(obmId)
  obmTypeId = ObjectId(obmTypeId)

  let newOrUpdatedDoc

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    newOrUpdatedDoc = await pulseCoreDb
      .collection('JOIN_obms_obms.types')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            _id,
            obmId,
            obmTypeId,
          },
        },
        { upsert: true, returnOriginal: false, session }
      )
      .then(({ value }) => value)

    const typeData = await pulseCoreDb.collection('obms.types').findOne({
      _id: newOrUpdatedDoc.obmTypeId,
    })

    await pulseDevDb.collection('obms').updateOne(
      { _id: newOrUpdatedDoc.obmId },
      {
        $set: {
          type: typeData,
        },
      },
      { session }
    )

    await pulseDevDb
      .collection('obmsPayers')
      .updateMany(
        { 'obm._id': newOrUpdatedDoc.obmId },
        { $set: { 'obm.type': typeData } },
        { session }
      )
  })

  return newOrUpdatedDoc
}

module.exports = connectObmAndObmType
