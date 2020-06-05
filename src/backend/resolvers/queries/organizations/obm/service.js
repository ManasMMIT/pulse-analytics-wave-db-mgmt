const obmServices = async (
  parent,
  args,
  { pulseCoreDb },
) => pulseCoreDb.collection('obm.services')
  .find()
  .toArray()

module.exports = obmServices
