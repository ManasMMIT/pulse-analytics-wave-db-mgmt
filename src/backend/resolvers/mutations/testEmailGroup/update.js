const { ObjectId } = require('mongodb')

const updateTestEmailGroup = (
  parent,
  {
    input: {
      _id,
      name,
      recipients,
      usersToMock,
      emailSubscriptions,
    },
  },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb.collection('testEmailGroups')
    .findOneAndUpdate(
      { _id: ObjectId(_id) },
      {
        $set: {
          name,
          recipients,
          usersToMock,
          emailSubscriptions,
        },
      },
      { returnOriginal: false },
    )
    .then(res => res.value)
}

module.exports = updateTestEmailGroup
