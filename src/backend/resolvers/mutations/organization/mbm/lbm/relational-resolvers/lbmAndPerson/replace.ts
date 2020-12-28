import _ from 'lodash'
import { ObjectId } from 'mongodb'

const aggPipelineToMaterializeConnectionsForSingleLbm = (lbmId) => [
  {
    $match: { lbmId },
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
      localField: 'lbmId',
      foreignField: '_id',
      as: 'lbm',
    },
  },
  {
    $project: {
      person: {
        $arrayElemAt: ['$person', 0],
      },
      lbm: {
        $arrayElemAt: ['$lbm', 0],
      },
      position: 1,
      managementTypes: {
        $ifNull: ['$managementTypes', []],
      },
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

// ! ASSUMPTION: this resolver is for connecting a SINGLE LBM to many people
const connectLbmAndPerson = async (
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
    ({ _id, personId, lbmId, position, managementTypes }) => ({
      _id: _id ? new ObjectId(_id) : new ObjectId(),
      personId: new ObjectId(personId),
      lbmId: new ObjectId(lbmId),
      position,
      managementTypes,
    })
  )

  const lbmId = coreDocsToInsert[0].lbmId

  await session.withTransaction(async () => {
    // Step 1: replace all existing entries affiliated with given lbm
    // with the incoming entries in core JOIN_lbms_people
    await pulseCoreDb
      .collection('JOIN_lbms_people')
      .deleteMany({ lbmId }, { session })

    await pulseCoreDb
      .collection('JOIN_lbms_people')
      .insertMany(coreDocsToInsert, { session })

    // Step 2: replace all existing entries affiliated with given lbm
    // with the incoming entries in dev lbmsInfluencers
    await pulseDevDb
      .collection('lbmsInfluencers')
      .deleteMany({ 'lbm._id': lbmId }, { session })

    const devDocsToInsert = await pulseCoreDb
      .collection('JOIN_lbms_people')
      .aggregate(aggPipelineToMaterializeConnectionsForSingleLbm(lbmId), {
        allowDiskUse: true,
        session,
      })
      .toArray()

    if (!_.isEmpty(devDocsToInsert)) {
      await pulseDevDb
        .collection('lbmsInfluencers')
        .insertMany(devDocsToInsert, { session })
    }
  })

  return coreDocsToInsert
}

export default connectLbmAndPerson
