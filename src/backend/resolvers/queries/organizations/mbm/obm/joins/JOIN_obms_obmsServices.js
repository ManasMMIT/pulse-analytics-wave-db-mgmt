const { ObjectId } = require('mongodb')

const JOIN_obms_obmsServices = (parent, { obmId }, { pulseCoreDb }) => {
  obmId = ObjectId(obmId)

  return pulseCoreDb
    .collection('JOIN_obms_obms.services')
    .find({ obmId })
    .toArray()
}

module.exports = JOIN_obms_obmsServices
