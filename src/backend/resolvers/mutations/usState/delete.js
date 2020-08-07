const { ObjectId } = require('mongodb')

const deleteUsState = async (
  parent,
  { input: { _id } },
  { pulseCoreDb, pulseDevDb },
  info
) => {
  _id = ObjectId(_id)

  const deleteStateInCoreOp = pulseCoreDb
    .collection('usStates')
    .findOneAndDelete({ _id })

  const deleteStateInDevOp = pulseDevDb
    .collection('statesStepEditLegislation')
    .deleteOne({ _id })

  const [{ value: deletedState }] = await Promise.all([
    deleteStateInCoreOp,
    deleteStateInDevOp,
  ])

  return deletedState
}

module.exports = deleteUsState
