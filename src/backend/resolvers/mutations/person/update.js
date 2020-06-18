const { ObjectId } = require('mongodb')

const updatePerson = (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('people')
  .findOneAndUpdate(
    { _id: ObjectId(_id) },
    {
      $set: body,
    },
    { returnOriginal: false }
  )
  .then(({ value }) => value)

module.exports = updatePerson
