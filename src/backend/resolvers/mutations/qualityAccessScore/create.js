const createQualityAccessScore = async (
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
  const newAccessScoreObj = {
    _id,
    access,
    accessTiny,
    score,
    sortOrder,
    color,
    relevance,
    caption,
  }
debugger
  await pulseDevDb.collection('qualityOfAccessScore').insertOne(newAccessScoreObj)
  const newAccessScore = await pulseCoreDb.collection('indications').insertOne(newAccessScoreObj)
debugger
  return newAccessScore.ops[0]
}

module.exports = createQualityAccessScore
