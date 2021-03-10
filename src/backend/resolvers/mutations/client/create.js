const axios = require('axios')
const { v4: uuid } = require('uuid')

const createClient = async (
  parent,
  { input: { description } },
  { mongoClient, coreClients, coreRoles },
  info
) => {
  if (!Boolean(description)) {
    throw Error('text field invalid')
  }

  const clientUuid = uuid()
  const mongoClientObj = {
    _id: clientUuid,
    name: description,
    description,
    uuid: clientUuid, // keeping this redundant field, as it's a convention for data migrating to vega
  }

  // TODO: this convention for default admin role's 'name' and 'description'
  // is being kept for now; it's still depended on in src/backend/resolvers/queries/teams.js;
  // CONSIDER not creating a default role at all; this is stg that had to be done back when
  // we didn't want admin hub 1.0 to break
  const defaultRoleName = `${description}-admin`
  const defaultRoleDescrip = 'admin'

  const roleUuid = uuid()
  const defaultMongoRole = {
    _id: roleUuid,
    name: defaultRoleName,
    description: defaultRoleDescrip,
    client: mongoClientObj,
    uuid: roleUuid, // keeping this redundant field, as it's a convention for data migrating to vega
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
    // ! Vega Ops
    await axios
      .post('clients/', { id: clientUuid, name: description })
      .catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })
    await axios
      .post('teams/', {
        id: roleUuid,
        name: defaultRoleDescrip,
        client: clientUuid,
      })
      .catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })

    // ! Mongo Ops
    const client = await coreClients.insertOne(mongoClientObj, { session })
    await coreRoles.insertOne(defaultMongoRole, { session })

    result = client.ops[0]
  })

  return result
}

module.exports = createClient
