const { ObjectId } = require('mongodb')

const deleteSourceIndication = async (
  parent,
  { input: { _id: indicationId } },
  { pulseCoreDb },
  info,
) => {
  const _id = ObjectId(indicationId)

  let result = await pulseCoreDb.collection('indications').findOneAndDelete(
    { _id },
  )

  result = result.value

  return result
}

module.exports = deleteSourceIndication
