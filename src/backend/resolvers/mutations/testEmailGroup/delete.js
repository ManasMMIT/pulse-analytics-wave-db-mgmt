const { ObjectId } = require('mongodb')

const deleteTestEmailGroup = (
  parent,
  { input: { _id } },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb.collection('testEmailGroups')
    .findOneAndDelete({ _id: ObjectId(_id) })
    .then(res => res.value)
}

module.exports = deleteTestEmailGroup
