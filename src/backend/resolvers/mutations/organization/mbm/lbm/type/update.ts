import { ObjectId } from 'mongodb'

const updateLbmType = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = new ObjectId(_id)

  let updatedLbmType

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Update core lbm service category
    updatedLbmType = await pulseCoreDb
      .collection('lbms.types')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session }
      )
      .then(({ value }) => value)

    // Step 2: Update any type subdocs materialized to dev
    await pulseDevDb.collection('lbms').updateMany(
      { 'type._id': updatedLbmType._id },
      {
        $set: {
          type: updatedLbmType,
        },
      },
      { session }
    )

    await pulseDevDb
      .collection('lbmsPayers')
      .updateMany(
        { 'lbm.type._id': _id },
        { $set: { 'lbm.type': updatedLbmType } },
        { session }
      )
  })

  return updatedLbmType
}

export default updateLbmType
