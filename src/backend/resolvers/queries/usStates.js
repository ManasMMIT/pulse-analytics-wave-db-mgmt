const usStates = (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('usStates').find().toArray()
}

module.exports = usStates
