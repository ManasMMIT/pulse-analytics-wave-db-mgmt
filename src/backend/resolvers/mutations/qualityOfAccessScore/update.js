const ObjectId = require('mongodb').ObjectId

const updateQualityAccessScore = async (
  parent,
  { input: { _id, access, accessTiny, score, sortOrder, color, caption } },
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

  const nestedAccessSetObj = {
    'accessData.access': access,
    'accessData.accessTiny': accessTiny,
    'accessData.score': score,
    'accessData.sortOrder': sortOrder,
    'accessData.color': color,
    'accessData.caption': caption,
  }

  const session = mongoClient.startSession()

  let result

  await session.withTransaction(async () => {
    const updateCoreQoaScoreOp = pulseCoreDb
      .collection('qualityOfAccessScore')
      .findOneAndUpdate(
        { _id },
        { $set: updateAccessScoreObj },
        { returnOriginal: false, session }
      )

    const updateCoreOrgTpHistoryOp = pulseCoreDb
      .collection('organizations.treatmentPlans.history')
      .updateMany(
        { 'accessData._id': _id },
        { $set: nestedAccessSetObj },
        { session }
      )

    const updateDevQoaScoreOp = pulseDevDb
      .collection('qualityOfAccessScore')
      .updateOne({ _id }, { $set: updateAccessScoreObj }, { session })

    const updateDevPayerLatestAccessOp = pulseDevDb
      .collection('payerLatestAccess')
      .updateMany(
        { 'accessData._id': _id },
        { $set: nestedAccessSetObj },
        { session }
      )

    const updateDevPayerHistoricalAccessOp = pulseDevDb
      .collection('payerHistoricalAccess')
      .updateMany(
        { 'accessData._id': _id },
        { $set: nestedAccessSetObj },
        { session }
      )

    const [newAccessScore] = await Promise.all([
      updateCoreQoaScoreOp,
      updateCoreOrgTpHistoryOp,
      updateDevQoaScoreOp,
      updateDevPayerLatestAccessOp,
      updateDevPayerHistoricalAccessOp,
    ])

    result = newAccessScore.value
  })

  return result
}

module.exports = updateQualityAccessScore
