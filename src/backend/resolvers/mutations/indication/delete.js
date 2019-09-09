const { ObjectId } = require('mongodb')

const deleteSourceIndication = async (
  parent,
  { input: { _id } },
  { pulseCoreDb },
  info,
) => {
  let result = await pulseCoreDb.collection('indications').findOneAndDelete(
    { _id: ObjectId(_id) },
  )

  result = result.value

  return result
}

module.exports = deleteSourceIndication
