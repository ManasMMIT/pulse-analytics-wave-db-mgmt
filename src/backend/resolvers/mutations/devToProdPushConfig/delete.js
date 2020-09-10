const { ObjectId } = require('mongodb')

const deleteDevToProdPushConfig = (
  parent,
  { input: { _id } },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb
    .collection('devToProdPushConfigs')
    .findOneAndDelete({ _id: ObjectId(_id) })
    .then(({ value }) => value)
}

module.exports = deleteDevToProdPushConfig
