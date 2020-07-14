module.exports = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('people').find().toArray()
