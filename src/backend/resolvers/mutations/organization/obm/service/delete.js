const { ObjectId } = require('mongodb')

const deleteObmService = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb, pulseDevDb },
  info
) => {
  _id = ObjectId(_id)

  let deletedObmService

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete service from own collection
    deletedObmService = await pulseCoreDb
      .collection('obms.services')
      .findOneAndDelete({ _id }, { session })
      .then(({ value }) => value)

    // Step 2: Cascade delete services and obm connections
    await pulseCoreDb
      .collection('JOIN_obms_obms.services')
      .deleteMany({ obmServiceId: deletedObmService._id }, { session })

    // Step 3: Cascade delete services to service category connections
    await pulseCoreDb
      .collection('JOIN_obms.services_obms.services.categories')
      .deleteMany({ obmServiceId: deletedObmService._id }, { session })

    // Step 4: Cascade delete materialized obmsServices docs
    await pulseDevDb
      .collection('obmsServices', { session })
      .deleteMany({ 'service._id': deletedObmService._id })
  })

  return deletedObmService
}

module.exports = deleteObmService
