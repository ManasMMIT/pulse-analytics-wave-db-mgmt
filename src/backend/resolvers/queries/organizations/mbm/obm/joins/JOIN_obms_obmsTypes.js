const { ObjectId } = require('mongodb')

const JOIN_obms_obmsTypes = (parent, { obmId }, { pulseCoreDb }) => {
  obmId = ObjectId(obmId)

  return pulseCoreDb
    .collection('JOIN_obms_obms.types')
    .find({ obmId })
    .toArray()
}

module.exports = JOIN_obms_obmsTypes
