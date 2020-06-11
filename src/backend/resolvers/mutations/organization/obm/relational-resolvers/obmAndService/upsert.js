const _ = require('lodash')
const { ObjectId } = require('mongodb')

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many services
const connectObmAndObmService = async (
  parent,
  { input }, 
  { pulseCoreDb, mongoClient },
  info,
) => {
  // Note: Error out if input is blank arr; otherwise we could get 
  // unexpected result where someone clears all services and op seems successful
  // but nothing in DB gets deleted (cuz there's no obmId to target for the deleteMany)
  if (_.isEmpty(input)) throw new Error("Can't save empty connections")

  const session = mongoClient.startSession()

  const docsToInsert = input.map(({
    _id,
    obmServiceId,
    obmId,
    rating,
  }) => ({
    _id: _id ? ObjectId(_id) : ObjectId(),
    obmServiceId: ObjectId(obmServiceId),
    obmId: ObjectId(obmId),
    rating: Number(rating),
  }))

  const obmId = docsToInsert[0].obmId
  
  await session.withTransaction(async () => {
    await pulseCoreDb.collection('obm_obm.services')
      .deleteMany({ obmId }, { session })

    await pulseCoreDb.collection('obm_obm.services')
      .insertMany(docsToInsert, { session })
  })

  return docsToInsert
}

module.exports = connectObmAndObmService
