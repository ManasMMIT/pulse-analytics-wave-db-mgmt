const { ObjectId } = require('mongodb')

const updateObmOrganization = async (
  parent,
  { input: { _id, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info,
) => {
  _id = ObjectId(_id)

  const session = mongoClient.startSession()

  let result

  await session.withTransaction(async () => {
    // Step 1: update org in organizations collection
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: body },
        { returnOriginal: false, session },
      )

    result = value

    // Step 2: update org.slug in all users.nodes.resources
    await pulseDevDb.collection('users.nodes.resources')
      .updateMany(
        { 'resources.accounts._id': _id },
        {
          $set: {
            'resources.$[resource].accounts.$[el].slug': result.slug,
          }
        },
        {
          arrayFilters: [
            { 'resource.accounts': { $exists: true } },
            { 'el._id': _id }
          ],
          session,
        }
      )
  })

  return result
}

module.exports = updateObmOrganization
