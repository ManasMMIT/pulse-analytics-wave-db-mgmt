import { ObjectId } from 'mongodb'

const deleteLbmService = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = new ObjectId(_id)

  let deletedLbmService

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete service from own collection
    deletedLbmService = await pulseCoreDb
      .collection('lbms.services')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: Cascade delete services and lbm connections
    await pulseCoreDb
      .collection('JOIN_lbms_lbms.services')
      .deleteMany({ lbmServiceId: deletedLbmService._id }, { session })

    // Step 3: Cascade delete services to service category connections
    await pulseCoreDb
      .collection('JOIN_lbms.services_lbms.services.categories')
      .deleteMany({ lbmServiceId: deletedLbmService._id }, { session })

    // Step 4: Cascade delete materialized lbmsServices docs
    await pulseDevDb
      .collection('lbmsServices', { session })
      .deleteMany({ 'service._id': deletedLbmService._id })
  })

  return deletedLbmService
}

export default deleteLbmService
