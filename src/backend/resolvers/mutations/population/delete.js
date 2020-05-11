const { ObjectId } = require('mongodb')

const deleteTreatmentPlansCascade = require('../utils/deleteTreatmentPlansCascade')

const deletePopulation = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info,
) => {
  _id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete population from its own collection
    const { value } = await pulseCoreDb
      .collection('populations')
      .findOneAndDelete({ _id }, { session })

    result = value

    // Step 2: Cascade deletion for treatment plans -> ptps -> ptp history -> trash history
    const treatmentPlans = await pulseCoreDb.collection('treatmentPlans')
      .find({ population: _id })
      .toArray()

    const treatmentPlanIds = treatmentPlans.map(({ _id }) => ObjectId(_id))

    if (treatmentPlanIds.length) {
      await deleteTreatmentPlansCascade({
        db: pulseCoreDb,
        treatmentPlanIds,
        session,
      })
    }
  })

  return result
}

module.exports = deletePopulation
