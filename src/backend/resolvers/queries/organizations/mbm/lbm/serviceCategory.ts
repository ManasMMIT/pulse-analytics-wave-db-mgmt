const lbmServicesCategories = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('lbms.services.categories').find().toArray()

export default lbmServicesCategories
