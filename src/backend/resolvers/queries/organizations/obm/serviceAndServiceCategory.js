const { ObjectId } = require('mongodb')

const obmServiceAndObmServiceCategoryConnections = (
  parent,
  { obmServiceId },
  { pulseCoreDb },
) => {
  obmServiceId = ObjectId(obmServiceId)

  return pulseCoreDb.collection('obm.services_obm.services.categories')
    .find({ obmServiceId })
    .toArray()
}

module.exports = obmServiceAndObmServiceCategoryConnections
