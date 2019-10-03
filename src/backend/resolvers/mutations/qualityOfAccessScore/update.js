const ObjectId = require('mongodb').ObjectId

const updateQualityAccessScore = async (
  parent,
  {
    input: {
      _id,
      access,
      accessTiny,
      score,
      sortOrder,
      color,
      caption,
    }
  },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const updateAccessScoreObj = {
    access,
    accessTiny,
    score: parseInt(score),
    sortOrder: parseInt(sortOrder),
    color,
    caption,
  }

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const newAccessScore = await pulseCoreDb.collection('qualityOfAccessScore')
      .findOneAndUpdate(
      { _id: ObjectId(_id) },
      { $set: { ...updateAccessScoreObj } },
      { returnOriginal: false, session }
    )

    await pulseDevDb.collection('qualityOfAccessScore').updateOne(
      { _id: ObjectId(_id) },
      {
        $set: {
          ...updateAccessScoreObj
        }
      },
      { session }
    )
  
    result = newAccessScore.value
  })

  return result

}

module.exports = updateQualityAccessScore
