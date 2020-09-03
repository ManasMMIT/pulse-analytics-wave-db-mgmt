const _ = require('lodash')
const { ObjectId } = require('mongodb')

const aggPipelineToMaterializeConnectionsForSingleObm = (obmId) => [
  {
    $match: { obmId },
  },
  {
    $lookup: {
      from: 'people',
      localField: 'personId',
      foreignField: '_id',
      as: 'person',
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
      person: {
        $arrayElemAt: ['$person', 0],
      },
      obm: {
        $arrayElemAt: ['$obm', 0],
      },
      position: 1,
      managementTypes: {
        $ifNull: ['$managementTypes', []],
      },
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
      person: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        nationalProviderIdentifier: 1,
      },
      position: 1,
      managementTypes: 1,
    },
  },
]

// ! ASSUMPTION: this resolver is for connecting a SINGLE OBM to many people
const connectObmAndPerson = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  // Note: Error out if input is blank arr; otherwise we could get
  // unexpected result where someone clears all people and op seems successful
  // but nothing in DB gets deleted (cuz there's no obmId to target for the deleteMany)
  if (_.isEmpty(input)) throw new Error("Can't save empty connections")

  const session = mongoClient.startSession()

  const coreDocsToInsert = input.map(
    ({ _id, personId, obmId, position, managementTypes }) => ({
      _id: _id ? ObjectId(_id) : ObjectId(),
      personId: ObjectId(personId),
      obmId: ObjectId(obmId),
      position,
      managementTypes,
    })
  )

  const obmId = coreDocsToInsert[0].obmId

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given obm
    // with the incoming entries in core JOIN_obms_people
    await pulseCoreDb
      .collection('JOIN_obms_people')
      .deleteMany({ obmId }, { session })

    await pulseCoreDb
      .collection('JOIN_obms_people')
      .insertMany(coreDocsToInsert, { session })

    // Step 2: replace all existing entries affiliated with given obm
    // with the incoming entries in dev obmsInfluencers
    await pulseDevDb
      .collection('obmsInfluencers')
      .deleteMany({ 'obm._id': obmId }, { session })

    const devDocsToInsert = await pulseCoreDb
      .collection('JOIN_obms_people')
      .aggregate(aggPipelineToMaterializeConnectionsForSingleObm(obmId), {
        allowDiskUse: true,
        session,
      })
      .toArray()

    if (!_.isEmpty(devDocsToInsert)) {
      await pulseDevDb
        .collection('obmsInfluencers')
        .insertMany(devDocsToInsert, { session })
    }
  })

  return coreDocsToInsert
}

module.exports = connectObmAndPerson
