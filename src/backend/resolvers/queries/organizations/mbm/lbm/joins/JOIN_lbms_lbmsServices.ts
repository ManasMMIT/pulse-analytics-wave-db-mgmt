import { ObjectId } from 'mongodb'

const JOIN_lbms_lbmsServices = (parent, { lbmId }, { pulseCoreDb }) => {
  lbmId = new ObjectId(lbmId)

  return pulseCoreDb
    .collection('JOIN_lbms_lbms.services')
    .find({ lbmId })
    .toArray()
}

export default JOIN_lbms_lbmsServices
