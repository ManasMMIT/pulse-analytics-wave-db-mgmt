const { ObjectId } = require('mongodb')

const updateConnectionsAndAlerts = require('./../utils/updateConnectionsAndAlerts')

const updatePayerOrganization = async (
  parent,
  { input: { _id: stringId, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info,
) => {
  const _id = ObjectId(stringId)

  const {
    connections: newConnections,
    ...setObj
  } = body

  const session = mongoClient.startSession()

  let result

  await session.withTransaction(async () => {
    // Step 1: update org in organizations collection
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: setObj },
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

    // Step 3: Rebuild connections and connection alerts
    const oldConnections = await pulseCoreDb
      .collection('organizations.connections')
      .find({ orgs: _id }, { session })
      .toArray()

    const connectionsWithIds = (newConnections || []).map(connection => ({
      ...connection,
      _id: connection._id
        ? ObjectId(connection._id)
        : new ObjectId(),
    }))

    result.connections = connectionsWithIds

    await updateConnectionsAndAlerts({
      db: pulseCoreDb,
      orgId: _id,
      oldConnections,
      newConnections: connectionsWithIds,
      session,
    })
  })

  return result
}

module.exports = updatePayerOrganization
