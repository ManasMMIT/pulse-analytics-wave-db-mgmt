const { ObjectId } = require('mongodb')
const _ = require('lodash')

const updateOrganization = async (
  parent,
  { input: { _id: stringId, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info,
) => {
  const _id = ObjectId(stringId)

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

    const { connections, ...updatedOrg } = result

    // Step 2: update org data in all org.connections
    await pulseCoreDb
      .collection('organizations')
      .updateMany(
        { 'connections.org._id': _id },
        {
          $set: {
            'connections.$[el].org': updatedOrg,
          }
        },
        {
          arrayFilters: [
            { 'el.org._id': _id }
          ],
          session,
        },
      )
    
    // Step 3: update org.slug in all users.nodes.resources
    await pulseDevDb.collection('users.nodes.resources')
        .updateMany(
          { 'resources.accounts._id': _id },
          {
            $set: {
              'resources.$[resource].accounts.$[el].slug': updatedOrg.slug,
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

module.exports = updateOrganization
