const { ObjectId } = require('mongodb')

const deleteTherapeuticArea = async (
  parent,
  { input: { _id } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  _id = ObjectId(_id)

  let deletedTherapeuticArea

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: delete the therapeutic area itself
    deletedTherapeuticArea = await pulseCoreDb
      .collection('therapeuticAreas')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: null out any references to the deleted therapeutic area from
    // the indications collection
    await pulseCoreDb
      .collection('indications')
      .updateMany(
        { therapeuticAreaId: _id },
        { $set: { therapeuticAreaId: null } },
        { session }
      )

    // Step 3: Delete any materialized indication/therapeuticArea connections
    // that are in pulse-dev.indicationsTherapeuticAreas
    await pulseDevDb
      .collection('indicationsTherapeuticAreas')
      .deleteMany({ therapeuticArea: deletedTherapeuticArea.name }, { session })
  })

  return deletedTherapeuticArea
}

module.exports = deleteTherapeuticArea
