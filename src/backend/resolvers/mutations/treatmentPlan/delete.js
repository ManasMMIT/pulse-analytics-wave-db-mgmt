const { ObjectId } = require('mongodb')

const deleteTreatmentPlansCascade = require('../utils/deleteTreatmentPlansCascade')

const deleteSourceTreatmentPlan = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  _id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    const value = await pulseCoreDb
      .collection('treatmentPlans')
      .findOne({ _id }, { session })

    result = value

    await deleteTreatmentPlansCascade({
      db: pulseCoreDb,
      treatmentPlanIds: [_id],
      session,
    })
  })

  return result
}

module.exports = deleteSourceTreatmentPlan
