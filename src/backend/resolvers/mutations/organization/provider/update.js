const { ObjectId } = require('mongodb')
const axios = require('axios')

const getSanitizedData = require('./../../collection/getSanitizedData')
const updateProvidersCollection = require('./../utils/updateProvidersCollection')
const updateConnectionsAndAlerts = require('./../utils/updateConnectionsAndAlerts')

const updateProviderOrganization = async (
  parent,
  { input: { _id: stringId, ...body } },
  { pulseCoreDb, pulseDevDb, mongoClient },
  info
) => {
  const _id = ObjectId(stringId)

  const { connections: newConnections, ...setObj } = body

  const cleanSetObj = getSanitizedData([setObj])[0]

  const session = mongoClient.startSession()

  let result

  await session.withTransaction(async () => {
    // ! Vega Op
    const { uuid } = await pulseCoreDb
      .collection('organizations')
      .findOne({ _id: ObjectId(stringId) })

    const { id: state_id } = body.state
      ? await axios
          .get(`states/?abbreviation=${body.state}`)
          .then(({ data }) => (data.length > 0 ? data[0] : { id: null }))
          .catch((e) => {
            throw new Error(JSON.stringify(e.response.data))
          })
      : { id: body.state }

    await axios
      .patch(`providers/${uuid}/`, {
        slug: body.slug,
        name: body.organization,
        name_tiny: body.organizationTiny,
        state_id,
      })
      .catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })

    // ! Mongo Ops
    // Step 1: update org in organizations collection
    const { value } = await pulseCoreDb
      .collection('organizations')
      .findOneAndUpdate(
        { _id },
        { $set: cleanSetObj },
        { returnOriginal: false, session }
      )

    result = value

    // Step 2: update org.slug in all users.nodes.resources
    await pulseDevDb.collection('users.nodes.resources').updateMany(
      { 'resources.accounts._id': _id },
      {
        $set: {
          'resources.$[resource].accounts.$[el].slug': result.slug,
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

    const connectionsWithNewState = (newConnections || []).map(
      (connection) => ({
        ...connection,
        _id: connection._id ? ObjectId(connection._id) : new ObjectId(),
        state: body.state,
      })
    )

    result.connections = connectionsWithNewState

    const insertConnectionsAndAlertsOps = updateConnectionsAndAlerts({
      db: pulseCoreDb,
      orgId: _id,
      oldConnections,
      newConnections: connectionsWithNewState,
      session,
    })

    // Step 4: rebuild provider collection docs for account
    const updateProvidersCollectionOp = updateProvidersCollection({
      db: pulseDevDb,
      account: result,
      oldConnections: oldConnections,
      newConnections: connectionsWithNewState,
      session,
    })

    await Promise.all([
      insertConnectionsAndAlertsOps,
      updateProvidersCollectionOp,
    ])
  })

  return result
}

module.exports = updateProviderOrganization
