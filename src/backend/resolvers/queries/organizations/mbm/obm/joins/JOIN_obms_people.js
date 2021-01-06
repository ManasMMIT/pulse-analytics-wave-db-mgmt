const JOIN_obms_people = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('JOIN_obms_people').find().toArray()

module.exports = JOIN_obms_people
