const { ObjectId } = require('mongodb')

const updateBook = (
  parent,
  { input: { _id, name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('books')
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

module.exports = updateBook
