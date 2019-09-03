const createIndication = (parent, { input: { name } }, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('indications').insertOne({ name })
    .then(res => res.ops[0])
}

module.exports = createIndication
