const { ObjectId } = require('mongodb')

const deleteService = async (
  parent,
  { input: { _id } },
  { mongoClient, pulseCoreDb },
  info
) => {
  _id = ObjectId(_id)

  let result

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // Step 1: Delete service from own collection
    const { value } = await pulseCoreDb
      .collection('obms.services')
      .findOneAndDelete({ _id }, { session })

    result = value

    // Step 2: Cascade delete services and obm connections
    await pulseCoreDb
      .collection('JOIN_obms_obms.services')
      .deleteMany({ obmServiceId: _id }, { session })

    // Step 3: Cascade delete services to service category connections
    await pulseCoreDb
      .collection('JOIN_obms.services_obms.services.categories')
      .deleteMany({ obmServiceId: _id }, { session })
  })

  return result
}

module.exports = deleteService
