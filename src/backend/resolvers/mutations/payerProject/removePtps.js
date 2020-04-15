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

  return 'WIP, no op...'
}

module.exports = removePtps
