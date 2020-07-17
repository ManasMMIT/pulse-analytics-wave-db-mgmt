const obmServicesCategories = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('obms.services.categories').find().toArray()

module.exports = obmServicesCategories
