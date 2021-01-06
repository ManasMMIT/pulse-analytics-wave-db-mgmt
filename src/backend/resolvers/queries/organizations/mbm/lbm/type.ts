const lbmTypes = (parent, args, { pulseCoreDb }) => pulseCoreDb.collection('lbms.types').find().toArray()

export default lbmTypes
