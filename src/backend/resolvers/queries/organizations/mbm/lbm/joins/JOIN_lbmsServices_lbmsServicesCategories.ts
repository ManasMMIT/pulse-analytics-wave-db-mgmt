import { ObjectId } from 'mongodb'

const JOIN_lbmsServices_lbmsServicesCategories = (
  parent,
  { lbmServiceId },
  { pulseCoreDb }
) => {
  lbmServiceId = new ObjectId(lbmServiceId)

  return pulseCoreDb
    .collection('JOIN_lbms.services_lbms.services.categories')
    .find({ lbmServiceId })
    .toArray()
}

export default JOIN_lbmsServices_lbmsServicesCategories
