const { ObjectId } = require('mongodb')

const updatePerson = (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb },
  info
) => {
  const updatedOn = new Date()

  return pulseCoreDb
    .collection('people')
    .findOneAndUpdate(
      { _id: ObjectId(_id) },
      {
        $set: {
          ...body,
          updatedOn,
        },
      },
      { returnOriginal: false }
    )
    .then(({ value }) => value)
}

module.exports = updatePerson
