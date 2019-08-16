const express = require('express')
const _ = require('lodash')

module.exports = ({
  // auth0
  auth0,

  // mongo guys
  mongoClient,
  mongoUsers,
  mongoRoles,
  mongoClients,

  // psql stuff
  User,
  Role,
  Client,
}) => {
  const subApp = express()

  subApp.get('/', async (req, res) => {
    let clients = await mongoClients.find().toArray()
    clients = _.sortBy(clients, ({ description }) => description.toLowerCase())
    res.json(clients)
  })

  subApp.get('/:id', async ({
    params: { id },
  }, res) => {
    const client = await mongoClients.findOne({ _id: id })
    res.json(client)
  })

  subApp.post('/', async ({ body: { description } }, res, next) => {
    if (!Boolean(description)) {
      next('text field invalid')
      return
    }

    // ! auth0
    // write to auth0, which autogenerates a UUID for client
    let clientInAuth0
    try {
      clientInAuth0 = await auth0.clients.create({ name: description, description })
    } catch (e) {
      next(e)
      return
    }

    // the create roles method in roles DAO creates both auth0 group and role
    const defaultRoleName = `${description}-admin`
    const defaultRoleDescrip = 'admin'

    const roleInAuth0 = await auth0.roles.create({
      clientId: clientInAuth0._id,
      name: defaultRoleName,
      description: defaultRoleDescrip,
    })

    // ! psql
    // use the generated UUID when writing to psql
    const clientInPsql = await Client.create({
      id: clientInAuth0._id,
      name: clientInAuth0.name,
      description: clientInAuth0.description,
    })

    const defaultRole = await Role.create({
      id: roleInAuth0._id,
      name: roleInAuth0.name,
      description: roleInAuth0.description,
    })

    await clientInPsql.addRole(defaultRole)

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
      sitemap: null,
      newSitemap: {
        tools: [],
        dashboards: [],
        pages: [],
        cards: [],
      },
      users: [],
      schemaVersion: 'v1.1.0',
    }

    const session = mongoClient.startSession()
    try {
      await session.withTransaction(async () => {
        const client = await mongoClients.insertOne(mongoClientObj, { session })

        await mongoRoles.insertOne(defaultMongoRole, { session })
        res.json(client.ops[0])
      })
    } catch (error) {
      next(error)
      return
    }
  })

  // ! Phase 2+ todos
  // TODO: Delete all teams, comprising associated subgroups and roles in auth0, psql
  // TODO: Delete all associated users in auth0, psql
  subApp.delete('/:id', async ({
    params: { id },
  }, res, next) => {
    // ! auth0
    try {
      await auth0.clients.delete(id)
    } catch (e) {
      next(e)
      return
    }

    // ! psql
    const client = await Client.findByPk(id)
    await client.destroy()

    // ! mongodb
    const session = mongoClient.startSession()

    try {
      await session.withTransaction(async () => {
        const client = mongoClients.findOne({ _id: id })

        await mongoClients.deleteOne({ _id: id }, { session })
        await mongoRoles.deleteMany({ "client._id": id }, { session })
        await mongoUsers.deleteMany({ "client._id": id }, { session })

        console.log(`Successfully deleted client ${client.description}`)
        res.json(client)
      })
    } catch (err) {
      next('failed to delete client\'s roles / users in mongoDB')
      return
    }
  })

  subApp.get('/:clientId/roles', async ({
    params: { clientId },
  }, res) => {
    const clientRoles = await mongoRoles.find({ "client._id": clientId }).toArray()

    const [[adminRole], restOfRoles] = _.partition(
      clientRoles,
      ({ name }) => name.includes('-admin')
    )

    adminRole.isDefault = true

    const sortedOtherRoles = _.sortBy(
      restOfRoles,
      ({ description }) => description.toLowerCase()
    )

    const result = [adminRole, ...sortedOtherRoles]

    res.json(result)
  })

  return subApp
}

  // ! TODO: Handle cascade naming updates (if updating client functionality is desired)
  // ! Would have to update subgroup and role name to prevent admin hub 1.0 breakage
  // subApp.patch('/clients/:id', async ({
  //   params: { id },
  //   body: { description },
  // }, res, next) => {
  //   if (!Boolean(description)) {
  //     next('text field invalid')
  //     return
  //   }

  //   const client = await Client.findByPk(id)

  //   if (!Boolean(client)) {
  //     next(`client with id ${ id } doesn't exist`)
  //     return
  //   }

  //   await auth0.clients.update({
  //     id,
  //     name: description,
  //     description: description,
  //   })

  //   const updatedClient = await client.update({
  //     name: description,
  //     description,
  //   })

  //   res.json(updatedClient)
  // })
