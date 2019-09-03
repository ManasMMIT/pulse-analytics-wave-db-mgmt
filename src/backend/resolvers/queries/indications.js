const indications =  (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('indications').find().toArray()
}

module.exports = indications
