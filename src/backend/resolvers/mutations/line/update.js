const { ObjectId } = require('mongodb')

const updateLine = (
  parent,
  { input: { _id, name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('lines')
  .findOneAndUpdate(
    { _id: ObjectId(_id) },
    {
      $set: {
        name
      }
    },
    { returnOriginal: false }
  )
  .then(({ value }) => value)

module.exports = updateLine
