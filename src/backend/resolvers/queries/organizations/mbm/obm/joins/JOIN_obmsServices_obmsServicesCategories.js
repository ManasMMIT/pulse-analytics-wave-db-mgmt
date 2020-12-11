const { ObjectId } = require('mongodb')

const JOIN_obmsServices_obmsServicesCategories = (
  parent,
  { obmServiceId },
  { pulseCoreDb }
) => {
  obmServiceId = ObjectId(obmServiceId)

  return pulseCoreDb
    .collection('JOIN_obms.services_obms.services.categories')
    .find({ obmServiceId })
    .toArray()
}

module.exports = JOIN_obmsServices_obmsServicesCategories
