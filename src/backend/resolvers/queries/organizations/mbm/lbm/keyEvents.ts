const lbmKeyEvents = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('lbms.keyEvents').find().toArray()

export default lbmKeyEvents
