const testEmailGroups = (parent, args, { pulseCoreDb }, info) => {
  return pulseCoreDb.collection('testEmailGroups')
    .find().toArray()
}

module.exports = testEmailGroups
