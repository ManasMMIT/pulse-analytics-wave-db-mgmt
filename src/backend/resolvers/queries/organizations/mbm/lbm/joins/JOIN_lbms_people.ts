const JOIN_lbms_people = (parent, args, { pulseCoreDb }) =>
  pulseCoreDb.collection('JOIN_lbms_people').find().toArray()

export default JOIN_lbms_people
