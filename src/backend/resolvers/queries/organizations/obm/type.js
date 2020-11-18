const obmTypes = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('obms.types').find().toArray()

module.exports = obmTypes
