const JOIN_pathways_people = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('JOIN_pathways_people').find().toArray()

module.exports = JOIN_pathways_people
