const indications =  (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('indications')
    .find()
    .sort({ name: 1 })
    .toArray()
}

module.exports = indications
