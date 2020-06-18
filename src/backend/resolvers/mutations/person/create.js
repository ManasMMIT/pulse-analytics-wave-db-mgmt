const createPerson = (
  parent,
  { input },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('people')
  .insertOne(input)
  .then(res => res.ops[0])

module.exports = createPerson
