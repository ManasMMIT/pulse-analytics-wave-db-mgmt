const { ObjectId } = require('mongodb')

const obmAndPayerConnections = (
  parent,
  { obmId },
  { pulseCoreDb },
) => {
  obmId = ObjectId(obmId)

  return pulseCoreDb.collection('obm_payers')
    .find({ obmId })
    .toArray()
}

module.exports = obmAndPayerConnections
