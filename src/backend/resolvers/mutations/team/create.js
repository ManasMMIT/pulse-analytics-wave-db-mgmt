const uuid = require('uuid/v4')

const createTeam = async (
  parent,
  { input: { description, clientId, defaultLandingPath } },
  { mongoClient, coreClients, coreRoles },
  info,
) => {
  if (!Boolean(description)) {
    throw Error('text field invalid')
  } else if (!clientId) {
    throw Error('clientId must be specified')
  }

  const session = mongoClient.startSession()

  let result = null

  await session.withTransaction(async () => {
    const client = await coreClients.findOne({ _id: clientId }, { session })

    const role = await coreRoles.insertOne({
      _id: uuid(),
      name: description,
      description,
      client,
      sitemap: {
        tools: [],
        dashboards: [],
        pages: [],
        cards: [],
      },
      users: [],
      defaultLandingPath,
      schemaVersion: 'v1.1.0'
    }, { session })

    result = role.ops[0]
  })

  return result
}

module.exports = createTeam
