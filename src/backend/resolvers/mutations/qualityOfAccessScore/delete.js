const ObjectId = require('mongodb').ObjectId

const deleteQualityOfAccessScore = async (
  parent,
  { input: { _id: accessId } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const _id = ObjectId(accessId)

  if (!Boolean(accessId)) {
    throw Error('must specify access id')
  }

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const coreAccessCollection = pulseCoreDb.collection('qualityOfAccessScore')
    const devAccessCollection = pulseDevDb.collection('qualityOfAccessScore')
    result = await coreAccessCollection.findOne({ _id })

    await coreAccessCollection.findOneAndDelete({ _id }, { session })
    await devAccessCollection.findOneAndDelete({ _id }, { session })
  })


  return result
}

module.exports = deleteQualityOfAccessScore
