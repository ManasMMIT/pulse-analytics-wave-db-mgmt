const obmAndPersonConnections = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('obm_people').find().toArray()

module.exports = obmAndPersonConnections
