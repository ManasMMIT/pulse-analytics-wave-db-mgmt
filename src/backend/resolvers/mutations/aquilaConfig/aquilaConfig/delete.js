const { ObjectId } = require('mongodb')

const deleteAquilaConfig = (
  parent,
  { input: { _id } },
  { pulseCoreDb }
) => pulseCoreDb.collection('businessObjects.aquilaConfigs')
  .findOneAndDelete({ _id: ObjectId(_id) })
  .then(({ value }) => value)

module.exports = deleteAquilaConfig
