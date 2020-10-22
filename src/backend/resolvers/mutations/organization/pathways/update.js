const { ObjectId } = require('mongodb')

const updateProvidersCollection = require('./../utils/updateProvidersCollection')
const updateConnectionsAndAlerts = require('./../utils/updateConnectionsAndAlerts')

const updatePathwaysOrganization = async (
  parent,
  { input: { _id: stringId, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const _id = ObjectId(stringId)

  const { connections: newConnections, ...setObj } = body

  const session = mongoClient.startSession()

  let updatedPathways

  await session.withTransaction(async () => {
    // Step 1: update org in organizations collection
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: setObj },
        { returnOriginal: false, session }
      )

    updatedPathways = value

    // Step 2: update org.slug in all users.nodes.resources
    await pulseDevDb.collection('users.nodes.resources').updateMany(
      { 'resources.accounts._id': _id },
      {
        $set: {
          'resources.$[resource].accounts.$[el].slug': updatedPathways.slug,
        },
      },
      {
        arrayFilters: [
          { 'resource.accounts': { $exists: true } },
          { 'el._id': _id },
        ],
        session,
      }
    )

    // Step 3: Rebuild connections and connection alerts
    const oldConnections = await pulseCoreDb
      .collection('organizations.connections')
      .find({ orgs: _id }, { session })
      .toArray()

    const connectionsWithIds = (newConnections || []).map((connection) => ({
      ...connection,
      _id: connection._id ? ObjectId(connection._id) : new ObjectId(),
    }))

    updatedPathways.connections = connectionsWithIds

    const insertConnectionsAndAlertsOps = updateConnectionsAndAlerts({
      db: pulseCoreDb,
      orgId: _id,
      oldConnections,
      newConnections: connectionsWithIds,
      session,
    })

    // Step 4: rebuild provider collection docs for account
    const updateProvidersCollectionOp = updateProvidersCollection({
      db: pulseDevDb,
      account: updatedPathways,
      oldConnections: oldConnections,
      newConnections: connectionsWithIds,
      session,
    })

    await Promise.all([
      insertConnectionsAndAlertsOps,
      updateProvidersCollectionOp,
    ])

    // Step 5: Update the TEMP_pathwaysInfluencers collection (soon to be pathwaysInfluencers) in pulse-dev
    await pulseDevDb.collection('TEMP_pathwaysInfluencers').updateMany(
      { pathwaysId: updatedPathways._id },
      {
        $set: {
          slug: updatedPathways.slug,
          organization: updatedPathways.organization,
          updatedOn: new Date(),
        },
      },
      { session }
    )
  })

  return updatedPathways
}

module.exports = updatePathwaysOrganization
