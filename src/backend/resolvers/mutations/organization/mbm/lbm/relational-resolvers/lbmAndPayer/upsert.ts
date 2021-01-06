import { ObjectId } from 'mongodb'

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
      localField: 'lbmId',
      foreignField: '_id',
      as: 'lbm',
    },
  },
  {
    $project: {
      payer: {
        $arrayElemAt: ['$payer', 0],
      },
      lbm: {
        $arrayElemAt: ['$lbm', 0],
      },
      note: 1,
      books: 1,
    },
  },
  {
    $project: {
      lbm: {
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
      from: 'JOIN_lbms_lbms.types',
      localField: 'lbm._id',
      foreignField: 'lbmId',
      as: 'lbm.type',
    },
  },
  {
    $addFields: {
      'lbm.type': {
        $arrayElemAt: ['$lbm.type', 0],
      },
    },
  },
  {
    $lookup: {
      from: 'lbms.types',
      localField: 'lbm.type.lbmTypeId',
      foreignField: '_id',
      as: 'lbm.type',
    },
  },
  {
    $addFields: {
      'lbm.type': {
        $arrayElemAt: ['$lbm.type', 0],
      },
    },
  },
]

const upsertLbmAndPayerConnection = async (
  parent,
  { input: { _id, lbmId, payerId, note, books } },
  { pulseCoreDb, pulseDevDb, mongoClient }
) => {
  _id = _id ? new ObjectId(_id) : new ObjectId()
  lbmId = new ObjectId(lbmId)
  payerId = new ObjectId(payerId)
  books.forEach((book) => {
    book._id = new ObjectId(book._id)
  })

  const session = mongoClient.startSession()

  let upsertedConnection

  await session.withTransaction(async () => {
    upsertedConnection = await pulseCoreDb
      .collection('JOIN_lbms_payers')
      .findOneAndUpdate(
        { _id },
        {
          $set: {
            lbmId,
            payerId,
            note,
            books,
          },
        },
        { upsert: true, returnOriginal: false, session }
      )
      .then(({ value }) => value)

    await pulseDevDb.collection('lbmsPayers').deleteOne({ _id }, { session })

    const docToInsertIntoDev = await pulseCoreDb
      .collection('JOIN_lbms_payers')
      .aggregate(getAggPipelineForDevJoinDoc(_id), { session })
      .next()

    await pulseDevDb
      .collection('lbmsPayers')
      .insertOne(docToInsertIntoDev, { session })
  })

  return upsertedConnection
}

export default upsertLbmAndPayerConnection
