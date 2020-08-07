const createUsState = async (
  parent,
  { input },
  { pulseCoreDb, pulseDevDb },
  info
) => {
  const createStateInCoreOp = pulseCoreDb
    .collection('usStates')
    .insertOne(input)
    .then((res) => res.ops[0])

  const createStateInDevOp = pulseDevDb
    .collection('statesStepEditLegislation')
    .insertOne(input)

  const [newState] = await Promise.all([
    createStateInCoreOp,
    createStateInDevOp,
  ])

  return newState
}

module.exports = createUsState
