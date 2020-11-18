const obmKeyEvents = async (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('obms.keyEvents').find().toArray()

module.exports = obmKeyEvents
