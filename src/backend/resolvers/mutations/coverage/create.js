const createCoverage = (
  parent,
  { input: { name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('coverages')
    .insertOne({ name })
    .then(res => res.ops[0])

module.exports = createCoverage
