import { ObjectId } from 'mongodb'

const deleteLbmServiceCategory = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = new ObjectId(_id)

  let deletedLbmServiceCategory

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete service category from own collection
    deletedLbmServiceCategory = await pulseCoreDb
      .collection('lbms.services.categories')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: Cascade delete service category connections to services
    await pulseCoreDb
      .collection('JOIN_lbms.services_lbms.services.categories')
      .deleteMany({ obmServiceCategoryId: _id }, { session })

    // Step 3: Cascade delete dev lbmsServices docs connected to category
    await pulseDevDb
      .collection('lbmsServices')
      .deleteMany({ 'service.categoryId': _id }, { session })
  })

  return deletedLbmServiceCategory
}

export default deleteLbmServiceCategory
