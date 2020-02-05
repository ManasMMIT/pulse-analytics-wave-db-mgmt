const createIndication = (
  parent,
  { input: { name, regimens = [] } },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb.collection('indications').insertOne({ name, regimens })
    .then(res => res.ops[0])
}

module.exports = createIndication
