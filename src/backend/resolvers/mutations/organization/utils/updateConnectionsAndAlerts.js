const { ObjectId } = require('mongodb')
const _ = require('lodash')

const isValidAlert = require('./isValidAlert')

module.exports = async ({
  db,
  orgId,
  oldConnections,
  newConnections,
  session,
}) => {
  const validConnectionsAndAlerts = getValidConnectionsAndAlerts(newConnections)

  // 1. Delete all connections
  await db.collection('organizations.connections')
    .deleteMany(
      { orgs: orgId },
      { session }
    )

  // 2. Insert new connections
  if (validConnectionsAndAlerts.length) {
    const orgConnectionDocs = getConnectionDocs(
      orgId,
      validConnectionsAndAlerts
    )

    await db.collection('organizations.connections')
      .insertMany(
        orgConnectionDocs,
        { session },
      )
  }

  // 3. Delete all connection alerts
  const oldConnectionIds = oldConnections.map(({ _id }) => _id)

  await db.collection('alerts')
    .deleteMany(
      { foreignId: { $in: oldConnectionIds} },
      { session }
    )

  // 4. Insert alert docs
  const alertDocs = validConnectionsAndAlerts.reduce((acc, { alert, _id }) => { 
    if (!isValidAlert(alert)) return acc

    const alertDoc = {
      _id: alert._id,
      date: new Date(alert.alertDate),
      type: alert.alertType,
      description: alert.alertDescription,
      sourceCollection: 'organizations.connections',
      foreignId: _id,
    }

    acc.push(alertDoc)

    return acc
  }, [])

  if (alertDocs.length) {
    await db.collection('alerts').insertMany(alertDocs, { session })
  }
}

const getValidConnectionsAndAlerts = connectionsWithAlerts => {
  const clonedConnections = _.cloneDeep(connectionsWithAlerts)

  return clonedConnections.reduce((acc, connection) => {
    if (!isValidAlert(connection.alert)) {
      delete connection.alert
    } else {
      const alertId = connection.alert._id
        ? ObjectId(connection.alert._id)
        : new ObjectId()

      connection.alert._id = alertId
    }

    acc.push(connection)

    return acc
  }, [])
}

const getConnectionDocs = (orgId, connections) => connections.map(connection => {
  let alertReference = isValidAlert(connection.alert)
    ? { alert: connection.alert._id }
    : {}

  return {
    _id: connection._id,
    orgs: [
      orgId,
      ObjectId(connection.org._id),
    ],
    category: connection.category,
    state: connection.state,
    note: connection.note,
    ...alertReference,
  }
})
