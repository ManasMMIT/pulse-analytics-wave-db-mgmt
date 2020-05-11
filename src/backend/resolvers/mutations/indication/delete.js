const { ObjectId } = require('mongodb')

const deleteTreatmentPlansCascade = require('./../utils/deleteTreatmentPlansCascade')

const deleteSourceIndication = async (
  parent,
  { input: { _id: indicationId } },
  { pulseCoreDb, coreRoles, mongoClient },
  info,
) => {
  const _id = ObjectId(indicationId)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // STEP 1: remove all indications (with nested regimens) from roles' resources
    await coreRoles.updateMany(
      {
        'resources.treatmentPlans._id': _id,
      },
      {
        $pull: {
          'resources.$[].treatmentPlans': { _id }
        }
      },
      { session },
    )

    // STEP 2: find all treatmentPlans with deleted indication and handle treatmentPlan deletion cascade
    const treatmentPlans = await pulseCoreDb.collection('treatmentPlans')
      .find(
        { indication: _id },
        { session },
      )
      .toArray()

    const tpIds = treatmentPlans.map(({ _id }) => _id)

    await deleteTreatmentPlansCascade({
      db: pulseCoreDb,
      treatmentPlanIds: tpIds,
      session,
    })

    // STEP 3: delete indication itself
    const { value } = await pulseCoreDb.collection('indications').deleteOne(
      { _id },
      { session },
    )

    result = value
  })

  return result
}

module.exports = deleteSourceIndication
