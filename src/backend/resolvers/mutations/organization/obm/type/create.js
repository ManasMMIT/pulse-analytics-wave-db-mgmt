const createObmType = (parent, { input }, { pulseCoreDb }, info) =>
  pulseCoreDb
    .collection('obms.types')
    .insertOne({ ...input })
    .then(({ ops }) => ops[0])

module.exports = createObmType
