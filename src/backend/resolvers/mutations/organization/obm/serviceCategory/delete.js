const { ObjectId } = require('mongodb')

const deleteServiceCategory = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info
) => {
  _id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete service category from own collection
    const { value } = await pulseCoreDb
      .collection('obm.services.categories')
      .findOneAndDelete({ _id }, { session })

    result = value

    // Step 2: Cascade delete service category connections to services
    await pulseCoreDb
      .collection('obm.services_obm.services.categories')
      .deleteMany({ obmServiceCategoryId: _id }, { session })
  })

  return result
}

module.exports = deleteServiceCategory
