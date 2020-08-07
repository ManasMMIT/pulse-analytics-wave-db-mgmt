const { ObjectId } = require('mongodb')

const updateUsState = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  let { _id, ...rest } = input

  _id = ObjectId(_id)
  const setObj = { $set: rest }

  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const updateStateInCoreOp = pulseCoreDb
      .collection('usStates')
      .findOneAndUpdate({ _id }, setObj, { returnOriginal: false, session })

    const updateStateInDevOp = pulseDevDb
      .collection('statesStepEditLegislation')
      .updateOne({ _id }, setObj, { upsert: true, session })

    const [{ value: updatedState }] = await Promise.all([
      updateStateInCoreOp,
      updateStateInDevOp,
    ])

    result = updatedState
  })

  return result
}

module.exports = updateUsState
