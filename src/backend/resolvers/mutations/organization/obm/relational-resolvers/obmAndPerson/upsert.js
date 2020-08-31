const _ = require('lodash')
const { ObjectId } = require('mongodb')

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many people
const connectObmAndPerson = async (
  parent,
  { input },
  { pulseCoreDb, mongoClient },
  info
) => {
  // Note: Error out if input is blank arr; otherwise we could get
  // unexpected result where someone clears all people and op seems successful
  // but nothing in DB gets deleted (cuz there's no obmId to target for the deleteMany)
  if (_.isEmpty(input)) throw new Error("Can't save empty connections")

  const session = mongoClient.startSession()

  const docsToInsert = input.map(
    ({ _id, personId, obmId, position, managementTypes }) => ({
      _id: _id ? ObjectId(_id) : ObjectId(),
      personId: ObjectId(personId),
      obmId: ObjectId(obmId),
      position,
      managementTypes,
    })
  )

  const obmId = docsToInsert[0].obmId

  await session.withTransaction(async () => {
    await pulseCoreDb
      .collection('JOIN_obms_people')
      .deleteMany({ obmId }, { session })

    await pulseCoreDb
      .collection('JOIN_obms_people')
      .insertMany(docsToInsert, { session })
  })

  return docsToInsert
}

module.exports = connectObmAndPerson
