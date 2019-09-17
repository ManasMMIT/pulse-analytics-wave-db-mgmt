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
      relevance,
      caption,
    }
  },
  { pulseCoreDb, pulseDevDb },
  info
) => {
  const updateAccessScoreObj = {
    access,
    accessTiny,
    score: parseInt(score),
    sortOrder: parseInt(sortOrder),
    color,
    relevance,
    indication: relevance,
    note: caption,
    caption: {
      [relevance]: caption,
    },
  }

  const newAccessScore = await pulseCoreDb.collection('qualityOfAccessScore')
    .findOneAndUpdate(
    { _id: ObjectId(_id) },
    { $set: { ...updateAccessScoreObj } },
    { returnOriginal: false }
  )

  await pulseCoreDb.collection('qualityAccessScores').updateOne(
    { _id: ObjectId(_id) },
    {
      $set: {
        ...updateAccessScoreObj
      }
    }
  )

  await pulseDevDb.collection('qualityOfAccessScore').updateOne(
    { _id: ObjectId(_id) },
    {
      $set: {
        ...updateAccessScoreObj
      }
    }
  )

  return newAccessScore.value
}

module.exports = updateQualityAccessScore
