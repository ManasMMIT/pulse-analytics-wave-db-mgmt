const JOIN_obms_payers = (parent, args, { pulseCoreDb }) => {
  return pulseCoreDb.collection('JOIN_obms_payers').find().toArray()
}

module.exports = JOIN_obms_payers
