const createLine = (
  parent,
  { input: { name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('lines')
    .insertOne({ name })
    .then(res => res.ops[0])

module.exports = createLine
