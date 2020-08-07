const { ObjectId } = require('mongodb')

const updateTherapeuticArea = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  let updatedTherapeuticArea

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: establish reference to the old therapeutic area
    const originalTherapeuticArea = await pulseCoreDb
      .collection('therapeuticAreas')
      .findOne({ _id })

    // Step 2: update the therapeutic area itself
    const { value } = await pulseCoreDb
      .collection('therapeuticAreas')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        {
          session,
          returnOriginal: false,
        }
      )

    updatedTherapeuticArea = value

    // Step 3: in pulse-dev, update any old therapeuticArea name to the new one if it's changed
    if (originalTherapeuticArea.name !== updatedTherapeuticArea.name) {
      await pulseDevDb
        .collection('indicationsTherapeuticAreas')
        .updateMany(
          { therapeuticArea: originalTherapeuticArea.name },
          { $set: { therapeuticArea: updatedTherapeuticArea.name } },
          { session }
        )
    }
  })

  return updatedTherapeuticArea
}

module.exports = updateTherapeuticArea
