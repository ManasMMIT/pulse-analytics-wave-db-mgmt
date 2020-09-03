const { ObjectId } = require('mongodb')

const deleteObmServiceCategory = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = ObjectId(_id)

  let deletedObmServiceCategory

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete service category from own collection
    deletedObmServiceCategory = await pulseCoreDb
      .collection('obms.services.categories')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: Cascade delete service category connections to services
    await pulseCoreDb
      .collection('JOIN_obms.services_obms.services.categories')
      .deleteMany({ obmServiceCategoryId: _id }, { session })

    // Step 3: Cascade delete dev obmsServices docs connected to category
    await pulseDevDb
      .collection('obmsServices')
      .deleteMany({ 'service.categoryId': _id }, { session })
  })

  return deletedObmServiceCategory
}

module.exports = deleteObmServiceCategory
