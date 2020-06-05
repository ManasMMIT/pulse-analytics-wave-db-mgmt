const obmServicesCategories = async (
  parent,
  args,
  { pulseCoreDb },
) => pulseCoreDb.collection('obm.services.categories')
  .find()
  .toArray()

module.exports = obmServicesCategories
