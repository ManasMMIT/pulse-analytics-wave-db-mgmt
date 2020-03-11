const uuid = require('uuid/v4')

const createClient = async (
  parent,
  { input: { description } },
  { mongoClient, coreClients, coreRoles },
  info
) => {
  if (!Boolean(description)) {
    throw Error('text field invalid')
  }

  const mongoClientObj = {
    _id: uuid(),
    name: description,
    description,
  }

  // TODO: this convention for default admin role's 'name' and 'description' 
  // is being kept for now; it's still depended on in src/backend/resolvers/queries/teams.js;
  // CONSIDER not creating a default role at all; this is stg that had to be done back when
  // we didn't want admin hub 1.0 to break
  const defaultRoleName = `${description}-admin`
  const defaultRoleDescrip = 'admin'

  const defaultMongoRole = {
    _id: uuid(),
    name: defaultRoleName,
    description: defaultRoleDescrip,
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
