const { ObjectId } = require('mongodb')

const createTestEmailGroup = (
  parent,
  args,
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb.collection('testEmailGroups')
    .insertOne({ _id: new ObjectId() })
    .then(res => res.ops[0])
}

module.exports = createTestEmailGroup
