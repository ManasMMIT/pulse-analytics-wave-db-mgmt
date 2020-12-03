const { ObjectId } = require('mongodb')

const getAggPipelineForDevJoinDoc = (joinDocId) => [
  {
    $match: {
      _id: joinDocId,
    },
  },
  {
    $lookup: {
      from: 'organizations',
      localField: 'payerId',
      foreignField: '_id',
      as: 'payer',
    },
  },
  {
    $lookup: {
      from: 'organizations',
      localField: 'obmId',
      foreignField: '_id',
      as: 'obm',
    },
  },
  {
    $project: {
      payer: {
        $arrayElemAt: ['$payer', 0],
      },
      obm: {
        $arrayElemAt: ['$obm', 0],
      },
      note: 1,
      books: 1,
    },
  },
  {
    $project: {
      obm: {
        _id: 1,
        slug: 1,
        organization: 1,
        organizationTiny: 1,
      },
      payer: {
        _id: 1,
        slug: 1,
        organization: 1,
        organizationTiny: 1,
      },
      note: 1,
      books: 1,
    },
  },
  {
    $lookup: {
      from: 'JOIN_obms_obms.types',
      localField: 'obm._id',
      foreignField: 'obmId',
      as: 'obm.type',
    },
  },
  {
    $addFields: {
      'obm.type': {
        $arrayElemAt: ['$obm.type', 0],
      },
    },
  },
  {
    $lookup: {
      from: 'obms.types',
      localField: 'obm.type.obmTypeId',
      foreignField: '_id',
      as: 'obm.type',
    },
  },
  {
    $addFields: {
      'obm.type': {
        $arrayElemAt: ['$obm.type', 0],
      },
    },
  },
]

const upsertObmAndPayerConnection = async (
  parent,
  { input: { _id, obmId, payerId, note, books } },
  { pulseCoreDb, pulseDevDb, mongoClient }
) => {
  _id = _id ? ObjectId(_id) : ObjectId()
  obmId = ObjectId(obmId)
  payerId = ObjectId(payerId)
  books.forEach((book) => {
    book._id = ObjectId(book._id)
  })

  const session = mongoClient.startSession()

  let upsertedConnection

  await session.withTransaction(async () => {
    upsertedConnection = await pulseCoreDb
      .collection('JOIN_obms_payers')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            obmId,
            payerId,
            note,
            books,
          },
        },
        { upsert: true, returnOriginal: false, session }
      )
      .then(({ value }) => value)

    await pulseDevDb.collection('obmsPayers').deleteOne({ _id }, { session })

    const docToInsertIntoDev = await pulseCoreDb
      .collection('JOIN_obms_payers')
      .aggregate(getAggPipelineForDevJoinDoc(_id), { session })
      .next()

    await pulseDevDb
      .collection('obmsPayers')
      .insertOne(docToInsertIntoDev, { session })
  })

  return upsertedConnection
}

module.exports = upsertObmAndPayerConnection
