const { ObjectId } = require('mongodb')

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many payers
const connectObmAndPayer = async (
  parent,
  { input: { obmId, connections } },
  { pulseCoreDb, mongoClient },
  info
) => {
  obmId = ObjectId(obmId)

  const session = mongoClient.startSession()

  const docsToInsert = connections.map(({ _id, payerId }) => ({
    _id: _id ? ObjectId(_id) : ObjectId(),
    payerId: ObjectId(payerId),
    obmId,
  }))

  await session.withTransaction(async () => {
    await pulseCoreDb
      .collection('JOIN_obms_payers')
      .deleteMany({ obmId }, { session })

    if (docsToInsert.length) {
      await pulseCoreDb
        .collection('JOIN_obms_payers')
        .insertMany(docsToInsert, { session })
    }
  })

  return docsToInsert
}

module.exports = connectObmAndPayer
