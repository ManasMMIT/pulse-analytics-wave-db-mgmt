const createPopulation = (
  parent,
  { input: { name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('populations')
  .insertOne({ name })
  .then(res => res.ops[0])

module.exports = createPopulation
