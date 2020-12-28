import { ObjectId } from 'mongodb'

const deleteLbmType = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = new ObjectId(_id)

  let deletedLbmType

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete lbm type from own collection
    deletedLbmType = await pulseCoreDb
      .collection('lbms.types')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: Delete lbm type connections
    await pulseCoreDb
      .collection('JOIN_lbms_lbms.types')
      .deleteMany({ lbmTypeId: _id }, { session })

    // Step 3: Delete any type subdocs materialized to dev
    await pulseDevDb.collection('lbms').updateMany(
      { 'type._id': _id },
      {
        $unset: {
          type: null,
        },
      },
      { session }
    )

    await pulseDevDb
      .collection('lbmsPayers')
      .updateMany(
        { 'lbm.type._id': _id },
        { $unset: { 'lbm.type': null } },
        { session }
      )
  })

  return deletedLbmType
}

export default deleteLbmType
