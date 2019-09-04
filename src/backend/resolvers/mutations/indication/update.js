const { ObjectId } = require('mongodb')

const updateSourceIndication = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb },
  info,
) => {
  let result = await pulseCoreDb.collection('indications').findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: body },
    { returnOriginal: false },
  )

  result = result.value

  return result
}

module.exports = updateSourceIndication
