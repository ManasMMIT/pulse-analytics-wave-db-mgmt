const { v4: uuid } = require('uuid')
const axios = require('axios')

const createTeam = async (
  parent,
  { input: { description, clientId, defaultLandingPath } },
  { mongoClient, coreClients, coreRoles },
  info
) => {
  if (!Boolean(description)) {
    throw Error('text field invalid')
  } else if (!clientId) {
    throw Error('clientId must be specified')
  }

  const session = mongoClient.startSession()

  let result = null

  await session.withTransaction(async () => {
    const roleUuid = uuid()
    const client = await coreClients.findOne({ _id: clientId }, { session })

    // ! Vega Op
    await axios
      .post('teams/', {
        id: roleUuid,
        name: description,
        client: client.uuid,
      })
      .catch((e) => {
        throw new Error(JSON.stringify(e.response.data))
      })

    // ! Mongo Op
    const role = await coreRoles.insertOne(
      {
        _id: roleUuid,
        name: description,
        description,
        client,
        sitemap: {
          tools: [],
          dashboards: [],
          pages: [],
          cards: [],
        },
        uuid: roleUuid, // stabilize schema with seeded roles in vega
        users: [],
        defaultLandingPath,
        schemaVersion: 'v1.1.0',
      },
      { session }
    )

    result = role.ops[0]
  })

  return result
}

module.exports = createTeam
