const { ObjectId } = require('mongodb')

const deleteSourceProduct = async (
  parent,
  { input: { _id } },
  { pulseCoreDb },
  info,
) => {
  let result = await pulseCoreDb.collection('products').findOneAndDelete(
    { _id: new ObjectId(_id) },
  )

  result = result.value

  return result
}

module.exports = deleteSourceProduct
