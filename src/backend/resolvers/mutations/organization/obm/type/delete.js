const { ObjectId } = require('mongodb')

const deleteObmType = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = ObjectId(_id)

  let deletedObmType

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete obm type from own collection
    deletedObmType = await pulseCoreDb
      .collection('obms.types')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: Delete obm type connections
    await pulseCoreDb
      .collection('JOIN_obms_obms.types')
      .deleteMany({ obmTypeId: _id }, { session })

    // Step 3: Delete any type subdocs materialized to dev
    await pulseDevDb.collection('obms').updateMany(
      { 'type._id': _id },
      {
        $unset: {
          type: null,
        },
      },
      { session }
    )

    await pulseDevDb
      .collection('obmsPayers')
      .updateMany(
        { 'obm.type._id': _id },
        { $unset: { 'obm.type': null } },
        { session }
      )
  })

  return deletedObmType
}

module.exports = deleteObmType
