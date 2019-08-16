const express = require('express')
const _ = require('lodash')

const wait = require('./../../utils/wait')

module.exports = ({
  // auth0
  auth0,

  // mongo guys
  mongoClient,
  mongoRoles,
  mongoClients,

  // psql stuff
  sequelize,
  User,
  Role,
  Client,
}) => {
  const subApp = express()

  subApp.get('/:roleId/clients', async ({
    params: { roleId },
  }, res) => {
    const role = await mongoRoles.findOne({ _id: roleId })
    const clientAssociatedWithRole = role.client
    res.json(clientAssociatedWithRole)
  })

  subApp.get('/', async (req, res) => {
    const roles = await mongoRoles.find().toArray()

    const sortedRoles = _.sortBy(roles, ({ name }) => name.toLowerCase())
    res.json(sortedRoles)
  })

  subApp.get('/:id', async ({
    params: { id },
  }, res) => {
    const role = await mongoRoles.findOne({ _id: id })
    res.json(role)
  })

  subApp.post('/', async ({
    body: { description, clientId },
  }, res, next) => {
    if (!Boolean(description)) {
      next('text field invalid')
      return
    } else if (!clientId) {
      next('clientId must be specified')
      return
    }

    // ! auth0
    const { name: clientName } = await auth0.clients.find(clientId)

    const dataObjForAuth0 = {
      clientId,
      name: `${clientName}-${description}`,
      description,
    }

    let roleCreatedInAuth0
    try {
      roleCreatedInAuth0 = await auth0.roles.create(dataObjForAuth0)
    } catch (e) {
      next(e)
      return
    }

    await wait()

    // ! psql
    const transaction = await sequelize.transaction()

    const roleInPsql = await Role.create(
      {
        id: roleCreatedInAuth0._id,
        name: roleCreatedInAuth0.name,
        description: roleCreatedInAuth0.description // follow auth0 weird casing coercion
      },
      { transaction }
    )

    const client = await Client.findByPk(clientId, { transaction })
    await roleInPsql.addClient(client, { transaction })

    transaction.commit()

    // ! mongodb
    const session = mongoClient.startSession()

    try {
      await session.withTransaction(async () => {
        const client = await mongoClients.findOne({ _id: clientId }, { session })

        const role = await mongoRoles.insertOne({
          _id: roleCreatedInAuth0._id,
          name: roleCreatedInAuth0.name,
          description: roleCreatedInAuth0.description,
          client,
          sitemap: [],
          newSitemap: {
            tools: [],
            dashboards: [],
            pages: [],
            cards: []
          },
          users: [],
          schemaVersion: 'v1.1.0'
        }, { session })

        res.json(role.ops[0])
      })
    } catch (error) {
      next(error)
      return
    }
  })

  // NOTE: assumption: a role's association with a client is never updated
  subApp.patch('/:id', async ({
    params: { id },
    body: { description },
  }, res, next) => {
    // ! auth0
    let roleInAuth0
    try {
      roleInAuth0 = await auth0.roles.update({ id, description })
    } catch (e) {
      next(e)
      return
    }

    // ! psql
    const roleInPsql = await Role.findByPk(id)

    await roleInPsql.update({
      name: roleInAuth0.name,
      description: roleInAuth0.description,
    })

    // ! mongodb

    // ! Note: Must use { returnOriginal: false }, which is specific to MongoDB node driver,
    // ! rather than { returnNewDocument: true }
    const { value: roleInMongo } = await mongoRoles.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name: roleInAuth0.name,
          description: roleInAuth0.description,
        }
      },
      { returnOriginal: false }
    )

    res.json(roleInMongo)
  })

  // ! NOTE 1: clientId is needed in the body for auth0 side
  // ! for severing association between client group and role group
  // ! NOTE 2: Phase 2+: TODO: Delete all users who are only associated with the deleted role
  subApp.delete('/:id', async ({
    params: { id },
    body: { clientId },
  }, res, next) => {
    if (!Boolean(clientId)) {
      next('must specify clientId')
      return
    }

    // ! auth0
    // TODO: Not sure this ACTUALLY DELETES THE ROLE (Only removes association?)
    // ! Note: when last checked on 8/1/19, this action DID delete the right group and role in Auth0
    try {
      await auth0.roles.delete({ id, clientId })
    } catch (e) {
      next(e)
      return
    }

    // ! psql
    const roleInPsql = await Role.findByPk(id)
    await roleInPsql.destroy()

    // ! mongodb
    const roleToDelete = await mongoRoles.findOne({ _id: id })
    await mongoRoles.findOneAndDelete({ _id: id })

    res.json(roleToDelete)
  })

  subApp.get('/:roleId/users', async ({
    params: { roleId },
  }, res) => {
    const { users: usersAssociatedWithRole } = await mongoRoles.findOne({ _id: roleId })

    res.json(usersAssociatedWithRole)
  })

  // subApp.get('/:roleId/nodes', roleNodesController)

  return subApp
}
