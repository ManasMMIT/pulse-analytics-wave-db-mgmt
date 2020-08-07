const createTherapeuticArea = (
  parent,
  { input: { name } },
  { pulseCoreDb },
  info
) =>
  pulseCoreDb
    .collection('therapeuticAreas')
    .insertOne({ name })
    .then((res) => res.ops[0])

module.exports = createTherapeuticArea
