const { ObjectId } = require('mongodb')

const deleteUsState = async (
  parent,
  { input: { _id } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const deleteStateInCoreOp = pulseCoreDb
      .collection('usStates')
      .findOneAndDelete({ _id }, { session })

    const deleteStateInDevOp = pulseDevDb
      .collection('statesStepEditLegislation')
      .deleteOne({ _id }, { session })

    const [{ value: deletedState }] = await Promise.all([
      deleteStateInCoreOp,
      deleteStateInDevOp,
    ])

    result = deletedState
  })

  return result
}

module.exports = deleteUsState
