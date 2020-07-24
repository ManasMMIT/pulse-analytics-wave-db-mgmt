const { ObjectId } = require('mongodb')

const deleteTreatmentPlansCascade = require('../utils/deleteTreatmentPlansCascade')

const deleteBook = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete book from its own collection
    const { value } = await pulseCoreDb
      .collection('books')
      .findOneAndDelete({ _id }, { session })

    result = value

    // Step 2: Cascade deletion for treatment plans -> ptps -> ptp history -> trash history
    const treatmentPlans = await pulseCoreDb
      .collection('treatmentPlans')
      .find({ book: _id })
      .toArray()

    const treatmentPlanIds = treatmentPlans.map(({ _id }) => ObjectId(_id))

    if (treatmentPlanIds.length) {
      await deleteTreatmentPlansCascade({
        pulseCoreDb,
        pulseDevDb,
        treatmentPlanIds,
        session,
      })
    }
  })

  return result
}

module.exports = deleteBook
