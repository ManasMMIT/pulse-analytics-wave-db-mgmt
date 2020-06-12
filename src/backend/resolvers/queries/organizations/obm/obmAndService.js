const { ObjectId } = require('mongodb')

const obmAndObmServiceConnections = (
  parent,
  { obmId },
  { pulseCoreDb },
) => {
  obmId = ObjectId(obmId)

  return pulseCoreDb.collection('obm_obm.services')
    .find({ obmId })
    .toArray()
}

module.exports = obmAndObmServiceConnections
