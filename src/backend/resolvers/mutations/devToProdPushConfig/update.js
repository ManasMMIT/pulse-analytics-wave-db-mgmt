const { ObjectId } = require('mongodb')

const updateDevToProdPushConfig = (
  parent,
  { input: { _id, name, collections } },
  { pulseCoreDb },
  info
) => {
  return pulseCoreDb
    .collection('devToProdPushConfigs')
    .findOneAndUpdate(
      { _id: ObjectId(_id) },
      {
        $set: {
          name,
          collections,
        },
      },
      { returnOriginal: false }
    )
    .then(({ value }) => value)
}

module.exports = updateDevToProdPushConfig
