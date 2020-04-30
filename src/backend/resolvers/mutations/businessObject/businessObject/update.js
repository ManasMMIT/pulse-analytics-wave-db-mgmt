const { ObjectId } = require('mongodb')

const updateBusinessObject = (
  parent,
  {
    input: {
      _id,
      name,
      sourceCollection,
    },
  },
  { pulseCoreDb },
  info
) => pulseCoreDb
  .collection('businessObjects')
  .findOneAndUpdate(
    { _id: ObjectId(_id) },
    {
      $set: {
        name,
        sourceCollection: {
          collection: sourceCollection,
        },
      }
    },
    { returnOriginal: false }
  )
  .then(({ value }) => value)

module.exports = updateBusinessObject
