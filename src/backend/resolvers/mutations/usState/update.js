const { ObjectId } = require('mongodb')

const updateUsState = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb },
  info
) => {
  let { _id, ...rest } = input

  _id = ObjectId(_id)
  const setObj = { $set: rest }

  const updateStateInCoreOp = pulseCoreDb
    .collection('usStates')
    .findOneAndUpdate({ _id }, setObj, { returnOriginal: false })

  const updateStateInDevOp = pulseDevDb
    .collection('statesStepEditLegislation')
    .updateOne({ _id }, setObj, { upsert: true })

  const [{ value: updatedState }] = await Promise.all([
    updateStateInCoreOp,
    updateStateInDevOp,
  ])

  return updatedState
}

module.exports = updateUsState
