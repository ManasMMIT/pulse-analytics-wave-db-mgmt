const createQualityOfAccessScore = async (
  parent,
  { input: { access, accessTiny, score, sortOrder, color, caption } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const newAccessScoreObj = {
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
    const newAccessScore = await pulseCoreDb
      .collection('qualityOfAccessScore')
      .insertOne(newAccessScoreObj, { session })

    await pulseDevDb
      .collection('qualityOfAccessScore')
      .insertOne(newAccessScoreObj, { session })

    result = newAccessScore.ops[0]
  })

  return result
}

module.exports = createQualityOfAccessScore
