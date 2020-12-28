const lbmServices = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('lbms.services').find().toArray()

export default lbmServices
