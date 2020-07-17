const { ObjectId } = require('mongodb')

const JOIN_obms_payers = (parent, { obmId }, { pulseCoreDb }) => {
  obmId = ObjectId(obmId)

  return pulseCoreDb.collection('JOIN_obms_payers').find({ obmId }).toArray()
}

module.exports = JOIN_obms_payers
