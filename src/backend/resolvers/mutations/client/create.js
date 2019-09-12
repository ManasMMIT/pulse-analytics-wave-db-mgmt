const createClient = async (
  parent,
  { input: { description } },
  { mongoClient, coreClients, coreRoles, auth0 },
  info
) => {
  if (!Boolean(description)) {
    throw Error('text field invalid')
  }

  // ! auth0
  // write to auth0, which autogenerates a UUID for client
  const clientInAuth0 = await auth0.clients
    .create({ name: description, description })

  // the create roles method in roles DAO creates both auth0 group and role
  const defaultRoleName = `${description}-admin`
  const defaultRoleDescrip = 'admin'

  const roleInAuth0 = await auth0.roles.create({
    clientId: clientInAuth0._id,
    name: defaultRoleName,
    description: defaultRoleDescrip,
  })

  // ! mongodb
  const mongoClientObj = {
    _id: clientInAuth0._id,
    name: clientInAuth0.name,
    description: clientInAuth0.description,
  }

  const defaultMongoRole = {
    _id: roleInAuth0._id,
    name: roleInAuth0.name,
    description: roleInAuth0.description,
    client: mongoClientObj,
    sitemap: {
      tools: [],
      dashboards: [],
      pages: [],
      cards: [],
    },
    users: [],
    schemaVersion: 'v1.1.0',
  }
  
  const session = mongoClient.startSession()
  
  let result = null

  await session.withTransaction(async () => {
    const client = await coreClients.insertOne(mongoClientObj, { session })

    await coreRoles.insertOne(defaultMongoRole, { session })

    result = client.ops[0]
  })

  return result
}

module.exports = createClient
