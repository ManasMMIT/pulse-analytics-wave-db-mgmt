const createLbmType = (parent, { input }, { pulseCoreDb }, info) =>
  pulseCoreDb
    .collection('lbms.types')
    .insertOne({ ...input })
    .then(({ ops }) => ops[0])

export default createLbmType
