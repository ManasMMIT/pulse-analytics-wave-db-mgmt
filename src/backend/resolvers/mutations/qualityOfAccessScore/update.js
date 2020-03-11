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
  _id = ObjectId(_id)
  score = parseInt(score)
  sortOrder = parseInt(sortOrder)

  const updateAccessScoreObj = {
    access,
    accessTiny,
    score,
    sortOrder,
    color,
    caption,
  }

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const newAccessScore = await pulseCoreDb.collection('qualityOfAccessScore')
      .findOneAndUpdate(
      { _id },
      { $set: { ...updateAccessScoreObj } },
      { returnOriginal: false, session }
    )

    await pulseDevDb.collection('qualityOfAccessScore').updateOne(
      { _id },
      {
        $set: {
          ...updateAccessScoreObj
        }
      },
      { session }
    )

    await pulseCoreDb.collection('organizations.treatmentPlans.history')
      .updateMany(
        { 'accessData._id': _id },
        {
          $set: {
            'accessData.access': access,
            'accessData.accessTiny': accessTiny,
            'accessData.score': score,
            'accessData.sortOrder': sortOrder,
            'accessData.color': color,
            'accessData.caption': caption,
          }
        },
        { session }
      )
  
    result = newAccessScore.value
  })

  return result

}

module.exports = updateQualityAccessScore
