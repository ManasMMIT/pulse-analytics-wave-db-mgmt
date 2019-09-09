const regimens =  (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('regimens').find().toArray()
}

module.exports = regimens
