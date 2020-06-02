const { ObjectId } = require('mongodb')

const updateAquilaConfig = async (
  parent,
  { input: { label, _id } },
  { pulseCoreDb }
) => {
  _id = ObjectId(_id)

  const updatedAquilaConfig = await pulseCoreDb.collection('businessObjects.aquilaConfigs')
    .findOneAndUpdate(
      { _id },
      { $set: { label } },
      { returnOriginal: false },
    )
    .then(({ value }) => value)

  return updatedAquilaConfig
}

module.exports = updateAquilaConfig
