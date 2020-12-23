const JOIN_lbms_payers = (parent, args, { pulseCoreDb }) => {
  return pulseCoreDb.collection('JOIN_lbms_payers').find().toArray()
}

export default JOIN_lbms_payers
