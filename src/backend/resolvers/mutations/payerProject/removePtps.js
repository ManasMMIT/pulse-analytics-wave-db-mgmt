const { ObjectId } = require('mongodb')

const removePtps = async (
  parent,
  {
    input: {
      orgTpIds,
    }
  },
  { pulseCoreDb },
  info
) => {
  orgTpIds = orgTpIds.map(ObjectId)

  await pulseCoreDb
    .collection('tdgProjects')
    .updateMany(
      {
        'orgTpIds': {
          $in: orgTpIds,
        }
      },
      {
        $pull: {
          orgTpIds: {
            $in: orgTpIds,
          }
        }
      }
    )

  return orgTpIds
}

module.exports = removePtps
