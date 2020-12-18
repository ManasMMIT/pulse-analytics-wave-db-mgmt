import { ObjectId } from 'mongodb'

import basicOrgDeletionOps from '../../basicOrgDeletionOps'

const getCascadeCollectionConfigs = ({ pulseDevDb, pulseCoreDb }) => [
  {
    db: pulseDevDb,
    key: '_id',
    collections: ['lbms'],
  },
  {
    db: pulseDevDb,
    key: 'lbmId',
    collections: ['lbmsKeyEvents'],
  },
  {
    db: pulseDevDb,
    key: 'lbm._id',
    collections: ['lbmsInfluencers', 'lbmsPayers', 'lbmsServices'],
  },
  {
    db: pulseCoreDb,
    key: 'lbmId',
    collections: [
      'JOIN_lbms_people',
      'JOIN_lbms_payers',
      'JOIN_lbms_lbms.types',
      'JOIN_lbms_lbms.services',
    ],
  },
]

const deleteLbmOrganization = async (
  parent,
  { input: { _id: stringId } },
  { pulseDevDb, pulseCoreDb, mongoClient },
  info
) => {
  const _id = new ObjectId(stringId)

  const session = mongoClient.startSession()

  let deletedOrg

  await session.withTransaction(async () => {
    // 1. Reuse shared org delete to cover basic ops
    deletedOrg = await basicOrgDeletionOps(_id, {
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    // 2. Delete org from top-level core and dev collections
    const cascadeCollectionConfigs = getCascadeCollectionConfigs({
      pulseDevDb,
      pulseCoreDb,
    })
    const topLevelCascadeOps = cascadeCollectionConfigs.map(
      ({ db, key, collections }) => {
        const ops = collections.map((collection) =>
          db.collection(collection).deleteMany({ [key]: _id }, { session })
        )

        return Promise.all(ops)
      }
    )

    // Promise.all is being used on array of Promise.all
    await Promise.all(topLevelCascadeOps)
  })

  return deletedOrg
}

export default deleteLbmOrganization
