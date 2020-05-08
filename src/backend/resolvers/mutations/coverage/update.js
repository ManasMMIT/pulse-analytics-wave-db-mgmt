const { ObjectId } = require('mongodb')

const updateCoverage = (
  parent,
  { input: { _id, name } },
  { pulseCoreDb },
  info
) => pulseCoreDb.collection('coverages')
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

module.exports = updateCoverage
