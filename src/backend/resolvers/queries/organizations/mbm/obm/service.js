const obmServices = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('obms.services').find().toArray()

module.exports = obmServices
