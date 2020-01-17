const { ObjectId } = require('mongodb')

const updateProvidersCollection = require('./../utils/updateProvidersCollection')

const updateApmOrganization = async (
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

    const connectionsWithIds = (newConnections || []).map(connection => ({
      ...connection,
      _id: connection._id
        ? ObjectId(connection._id)
        : new ObjectId(),
    }))

    result.connections = connectionsWithIds

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

    // Step 3: clear all connections from orgs.connections

    // ! make sure to grab old connections for providers collection work later
    const oldConnections = await pulseCoreDb
      .collection('organizations.connections')
      .find({ orgs: _id }, { session })
      .toArray()

    await pulseCoreDb.collection('organizations.connections')
      .deleteMany(
        { orgs: _id },
        { session }
      )
    
    // Step 4: insert new docs into orgs.connections
    const orgConnectionsDocs = connectionsWithIds.map(connection => ({
      _id: connection._id,
      orgs: [
        _id,
        ObjectId(connection.org._id),
      ],
      category: connection.category,
      state: connection.state,
    }))
  
    if (orgConnectionsDocs.length) {
      await pulseCoreDb.collection('organizations.connections')
        .insertMany(
          orgConnectionsDocs,
          { session },
        )
    }

    // Step 5: rebuild provider collection docs for account
    await updateProvidersCollection({
      db: pulseDevDb,
      account: result,
      oldConnections: oldConnections,
      newConnections: connectionsWithIds,
      session,
    })
  })

  return result
}

module.exports = updateApmOrganization
