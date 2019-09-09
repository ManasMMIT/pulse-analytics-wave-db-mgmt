const { ObjectId } = require('mongodb')

const deleteSourceRegimen = async (
  parent,
  { input: { _id } },
  { pulseCoreDb },
  info,
) => {
  let result = await pulseCoreDb.collection('regimens').findOneAndDelete(
    { _id: ObjectId(_id) },
  )

  result = result.value

  return result
}

module.exports = deleteSourceRegimen
