const createPerson = (parent, { input }, { pulseCoreDb }, info) => {
  const createdOn = new Date()

  return pulseCoreDb
    .collection('people')
    .insertOne({
      ...input,
      createdOn,
      updatedOn: createdOn,
    })
    .then((res) => res.ops[0])
}

module.exports = createPerson
