const { ObjectId } = require('mongodb')

const updateObmServiceCategory = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb },
  info
) => {
  _id = ObjectId(_id)

  const { value } = await pulseCoreDb
    .collection('obms.services.categories')
    .findOneAndUpdate({ _id }, { $set: body }, { returnOriginal: false })

  return value
}

module.exports = updateObmServiceCategory
