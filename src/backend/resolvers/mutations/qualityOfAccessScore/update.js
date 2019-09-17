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
    _id,
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
    .updateOne(
      { _id },
      {
        $set: {
          ...updateAccessScoreObj
        }
      }
    )
  await pulseCoreDb.collection('qualityAccessScores').updateOne(
    { _id },
    {
      $set: {
        ...updateAccessScoreObj
      }
    }
  )
  // await pulseDevDb.collection('qualityOfAccessScore').updateOne(
  //   { _id },
  //   {
  //     $set: {
  //       ...updateAccessScoreObj
  //     }
  //   }
  // )

  return newAccessScore.ops[0]
}

module.exports = updateQualityAccessScore
