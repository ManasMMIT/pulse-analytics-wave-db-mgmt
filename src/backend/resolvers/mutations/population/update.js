const { ObjectId } = require('mongodb')

const updatePopulation = (
  parent,
  { input: { _id, name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('populations')
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

module.exports = updatePopulation
