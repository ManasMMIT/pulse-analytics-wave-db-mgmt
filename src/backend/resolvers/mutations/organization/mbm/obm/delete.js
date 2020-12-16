const { ObjectId } = require('mongodb')

const basicOrgDeletionOps = require('../../basicOrgDeletionOps')

const getCascadeCollectionConfigs = ({ pulseDevDb, pulseCoreDb }) => [
  {
    db: pulseDevDb,
    key: '_id',
    collections: ['obms'],
  },
  {
    db: pulseDevDb,
    key: 'obmId',
    collections: ['obmsKeyEvents'],
  },
  {
    db: pulseDevDb,
    key: 'obm._id',
    collections: ['obmsInfluencers', 'obmsPayers', 'obmsServices'],
  },
  {
    db: pulseCoreDb,
    key: 'obmId',
    collections: [
      'JOIN_obms_people',
      'JOIN_obms_payers',
      'JOIN_obms_obms.types',
      'JOIN_obms_obms.services',
    ],
  },
]

const deleteObm = async (
  parent,
  { input: { _id: stringId } },
  { pulseDevDb, pulseCoreDb, mongoClient },
  info
) => {
  const _id = ObjectId(stringId)

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

module.exports = deleteObm
