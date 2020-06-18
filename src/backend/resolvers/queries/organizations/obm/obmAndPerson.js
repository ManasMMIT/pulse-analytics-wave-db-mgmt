const { ObjectId } = require('mongodb')

const obmAndPersonConnections = (
  parent,
  { obmId },
  { pulseCoreDb },
) => {
  obmId = ObjectId(obmId)

  return pulseCoreDb.collection('obm_people')
    .find({ obmId })
    .toArray()
}

module.exports = obmAndPersonConnections
