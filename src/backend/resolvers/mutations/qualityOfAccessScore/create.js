const createQualityOfAccessScore = async (
  parent,
  {
    input: {
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
  const newAccessScoreObj = {
    access,
    accessTiny,
    score: parseInt(score),
    sortOrder: parseInt(sortOrder),
    color,
    relevance,
    indication: relevance,
    note:caption,
    caption: {
      [relevance]: caption,
    },
  }

  const newAccessScore = await pulseCoreDb.collection('qualityOfAccessScore')
  .insertOne(newAccessScoreObj)

  await pulseCoreDb.collection('qualityAccessScores').insertOne(newAccessScoreObj)

  await pulseDevDb.collection('qualityOfAccessScore').insertOne(newAccessScoreObj)

  return newAccessScore.ops[0]
}

module.exports = createQualityOfAccessScore
