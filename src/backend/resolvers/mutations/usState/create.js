const createUsState = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const session = mongoClient.startSession()

  let result
  await session.withTransaction(async () => {
    const createdStateInCore = await pulseCoreDb
      .collection('usStates')
      .insertOne(input, { session })
      .then((res) => res.ops[0])

    await pulseDevDb
      .collection('statesStepEditLegislation')
      .insertOne(createdStateInCore, { session })

    result = createdStateInCore
  })

  return result
}

module.exports = createUsState
