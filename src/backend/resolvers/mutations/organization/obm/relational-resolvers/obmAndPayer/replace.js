const _ = require('lodash')
const { ObjectId } = require('mongodb')

const getObmPayerMaterializationPipeline = (obmId) => [
  {
    $match: { obmId },
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
    $lookup: {
      from: 'books',
      localField: 'bookIds',
      foreignField: '_id',
      as: 'books',
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
      books: '$books.name',
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
]

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many payers
const connectObmAndPayer = async (
  parent,
  { input: { obmId, connections } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  obmId = ObjectId(obmId)

  const session = mongoClient.startSession()

  const docsToInsert = connections.map(({ _id, payerId, bookIds, note }) => ({
    _id: _id ? ObjectId(_id) : ObjectId(),
    payerId: ObjectId(payerId),
    obmId,
    bookIds: (bookIds || []).map((bookId) => ObjectId(bookId)),
    note,
  }))

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given obm
    // with the incoming entries in core JOIN_obms_payers
    await pulseCoreDb
      .collection('JOIN_obms_payers')
      .deleteMany({ obmId }, { session })

    if (docsToInsert.length) {
      await pulseCoreDb
        .collection('JOIN_obms_payers')
        .insertMany(docsToInsert, { session })
    }

    // Step 2: replace all existing entries affiliated with given obm
    // with the incoming entries in dev obmsInfluencers
    await pulseDevDb
      .collection('obmsPayers')
      .deleteMany({ 'obm._id': obmId }, { session })

    const devDocsToInsert = await pulseCoreDb
      .collection('JOIN_obms_payers')
      .aggregate(getObmPayerMaterializationPipeline(obmId), {
        allowDiskUse: true,
        session,
      })
      .toArray()

    if (!_.isEmpty(devDocsToInsert)) {
      await pulseDevDb
        .collection('obmsPayers')
        .insertMany(devDocsToInsert, { session })
    }
  })

  return docsToInsert
}

module.exports = connectObmAndPayer
