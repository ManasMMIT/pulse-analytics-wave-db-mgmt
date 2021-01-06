const { ObjectId } = require('mongodb')

const updateObmType = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  let updatedObmType

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update core obm service category
    updatedObmType = await pulseCoreDb
      .collection('obms.types')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update any type subdocs materialized to dev
    await pulseDevDb.collection('obms').updateMany(
      { 'type._id': updatedObmType._id },
      {
        $set: {
          type: updatedObmType,
        },
      },
      { session }
    )

    await pulseDevDb
      .collection('obmsPayers')
      .updateMany(
        { 'obm.type._id': _id },
        { $set: { 'obm.type': updatedObmType } },
        { session }
      )
  })

  return updatedObmType
}

module.exports = updateObmType
