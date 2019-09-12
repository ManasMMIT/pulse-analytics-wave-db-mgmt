const createTeam = async (
  parent,
  { input: { description, clientId } },
  { mongoClient, coreClients, coreRoles, auth0 },
  info,
) => {
  if (!Boolean(description)) {
    throw Error('text field invalid')
  } else if (!clientId) {
    throw Error('clientId must be specified')
  }

  // ! auth0
  const { name: clientName } = await auth0.clients.find(clientId)

  const dataObjForAuth0 = {
    clientId,
    name: `${clientName}-${description}`,
    description,
  }

  const roleCreatedInAuth0 = await auth0.roles
    .create(dataObjForAuth0)

  // ! mongodb
  const session = mongoClient.startSession()

  let result = null
  await session.withTransaction(async () => {
    const client = await coreClients.findOne({ _id: clientId }, { session })

    const role = await coreRoles.insertOne({
      _id: roleCreatedInAuth0._id,
      name: roleCreatedInAuth0.name,
      description: roleCreatedInAuth0.description,
      client,
      sitemap: {
        tools: [],
        dashboards: [],
        pages: [],
        cards: []
      },
      users: [],
      schemaVersion: 'v1.1.0'
    }, { session })

    result = role.ops[0]
  })

  return result
}

module.exports = createTeam
