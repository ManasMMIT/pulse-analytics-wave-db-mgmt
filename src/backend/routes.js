require('dotenv').load()
const wait = require('./../utils/wait')
const express = require('express')
const _ = require('lodash')

const MongoClient = require('mongodb').MongoClient

let mongoClient, mongoUsers, mongoRoles, mongoNodes, mongoClients
MongoClient.connect(process.env.LOADER_URI, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  mongoClient = client
  const pulseCore = client.db('pulse-core')

  mongoUsers = pulseCore.collection('users')
  mongoRoles = pulseCore.collection('roles')
  mongoNodes = pulseCore.collection('nodes')
  mongoClients = pulseCore.collection('clients')

  console.log(`Connected to MongoDB: ${process.env.LOADER_URI}`)
})

// TODO: Uninstall uuid because auth0 has control over ids!
// ? temporary until we change the user model via sequelize migration
// const uuid = require('uuid/v4')

const auth0 = require('./auth0')

const {
  sequelize,
  models: {
    Client,
    User,
    Role,
  }
} = require('./sequelize')

const subApp = express()

subApp.get('/sitemaps/:roleId', async ({
  params: { roleId },
}, res) => {
  const role = await mongoRoles.findOne({ _id: roleId })
  const sitemap = role.sitemap ? role.sitemap : {}

  res.json(sitemap)
})

subApp.get('/clients', async (req, res) => {
  // ! psql
  const clients = await Client.findAll()

  // ! mongodb
  // let clients = await mongoClients.find().toArray()
  // clients = _.sortBy(clients, ({ description }) => description.toLowerCase())
  res.json(clients)
})

subApp.get('/clients/:id', async ({
  params: { id },
}, res) => {
  // ! psql
  const client = await Client.findByPk(id)

  // ! mongodb
  // const client = await mongoClients.findOne({ _id: id })
  res.json(client)
})

subApp.post('/clients', async ({ body: { description } }, res, next) => {
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
      /* const client = */  await mongoClients.insertOne(mongoClientObj, { session })
      await mongoRoles.insertOne(defaultMongoRole, { session })
      // res.json(client.ops[0])
    })
  } catch (error) {
    next(error)
    return
  }

  res.json(clientInPsql)
})

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

// ! Phase 2+ todos
// TODO: Delete all teams, comprising associated subgroups and roles in auth0, psql
// TODO: Delete all associated users in auth0, psql
subApp.delete('/clients/:id', async ({
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
      await mongoClients.deleteOne({ _id: id }, { session })
      await mongoRoles.deleteMany({ "client._id": id }, { session })
      await mongoUsers.deleteMany({ "client._id": id }, { session })
    })
  } catch (err) {
    next('failed to delete client\'s roles / users in mongoDB')
    return
  }

  console.log(`Successfully deleted client ${client.description}`)
  res.json(client)
})

subApp.get('/clients/:clientId/roles', async ({
  params: { clientId },
}, res) => {
  // ! psql
  const client = await Client.findByPk(clientId)
  const clientRoles = await client.getRoles({ raw: true })

  // ! mongodb
  // const clientRoles = await mongoRoles.find({ "client._id": clientId }).toArray()

  // ! shared
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

subApp.get('/roles/:roleId/clients', async ({
  params: { roleId },
}, res) => {
  // ! psql
  const role = await Role.findByPk(roleId)
  const clientsAssociatedWithRole = await role.getClients()
  // there should only be one client associated with a role
  const clientAssociatedWithRole = clientsAssociatedWithRole[0]

  // ! mongodb
  // const role = await mongoRoles.findOne({ _id: roleId })
  // const clientAssociatedWithRole = role.client
  res.json(clientAssociatedWithRole)
})

subApp.get('/roles', async (req, res) => {
  // ! psql
  const roles = await Role.findAll()

  // ! mongodb
  // const roles = await mongoRoles.find().toArray()

  // ! shared
  const sortedRoles = _.sortBy(roles, ({ name }) => name.toLowerCase())
  res.json(sortedRoles)
})

subApp.get('/roles/:id', async ({
  params: { id },
}, res) => {
  // ! psql
  const role = await Role.findByPk(id)

  // ! mongodb
  // const role = await mongoRoles.findOne({ _id: id })
  res.json(role)
})

subApp.post('/roles', async ({
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

      /* const role = */ await mongoRoles.insertOne({
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

      // res.json(role.ops[0])
    })
  } catch (error) {
    next(error)
    return
  }

  res.json(roleInPsql)
})

// NOTE: assumption: a role's association with a client is never updated
subApp.patch('/roles/:id', async ({
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

  const updatedRole = await roleInPsql.update({
    name: roleInAuth0.name,
    description: roleInAuth0.description,
  })

  // ! mongodb

  // ! Note: after testing, it looks like 'roleInMongo' is the original doc, not the updated one
  // ! THIS IS DESPITE WHAT THE DOCS SAY ABOUT { returnNewDocument: true }
  /* const { value: roleInMongo } = */ await mongoRoles.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: roleInAuth0.name,
        description: roleInAuth0.description,
      }
    },
    { returnNewDocument: true }
  )

  res.json(updatedRole)
})

// ! NOTE 1: clientId is needed in the body for auth0 side
// ! for severing association between client group and role group
// ! NOTE 2: Phase 2+: TODO: Delete all users who are only associated with the deleted role
subApp.delete('/roles/:id', async ({
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
  /* const { value: deletedRole } = */ await mongoRoles.findOneAndDelete({ _id: id })

  res.json(roleInPsql)
})

subApp.get('/roles/:roleId/users', async ({
  params: { roleId },
}, res) => {
  // ! psql
  const role = await Role.findByPk(roleId)

  // get all the users linked to the selected role, but also for each
  // user, get all the roles associated with that individual user
  const usersAssociatedWithRole = await role.getUsers({ include: [{ model: Role }] })

  // ! mongodb
  // const { users: usersAssociatedWithRole } = await mongoRoles.findOne({ _id: roleId })

  res.json(usersAssociatedWithRole)
})

subApp.get('/users/:userId/roles', async ({
  params: { userId },
}, res) => {
  // ! psql
  const user = await User.findByPk(userId)
  const rolesAssociatedWithUser = await user.getRoles()

  // ! mongodb
  // const rolesAssociatedWithUser = await mongoRoles.find({ 'users._id': userId }).toArray()

  res.json(rolesAssociatedWithUser)
})

subApp.get('/users', async (req, res) => {
  // ! psql
  const users = await User.findAll()

  // ! mongodb
  // const users = await mongoUsers.find().toArray()
  res.json(users)
})

subApp.get('/users/:id', async ({
  params: { id },
}, res) => {
  // ! psql
  const user = await User.findByPk(id)

  // ! mongodb
  // const user = await mongoUsers.findOne({ _id: id })
  res.json(user)
})

subApp.post('/users', async ({
  body: { username, email, password, clientId, roles },
}, res, next) => {
  if (!Boolean(username)) {
    next('username field invalid')
    return
  } else if (username.includes(' ')) {
    next('username cannot have spaces')
    return
  } else if (!Boolean(email)) {
    next('email field invalid')
    return
  } else if (_.isEmpty(roles) || !Array.isArray(roles)) {
    next('must specify at least one role in an array')
    return
  }

  // ! auth0
  let userInAuth0
  try {
    userInAuth0 = await auth0.users.create({ username, email, password })
  } catch(e) {
    next(e)
    return
  }

  await wait()
  await auth0.authClient.addGroupMember(clientId, userInAuth0.user_id)

  for (const roleId of roles) {
    await wait()
    await auth0.authClient.addGroupMember(roleId, userInAuth0.user_id)
  }

  // ! psql
  const transaction = await sequelize.transaction()

  const userInPsql = await User.create(
    { id: userInAuth0.user_id, username, email },
    { transaction }
  )

  const rolesInPsql = await Role.findAll({ where: { id: roles } }, { transaction })
  await userInPsql.addRoles(rolesInPsql, { transaction })

  transaction.commit()

  // ! mongodb
  const session = mongoClient.startSession()

  try {
    await session.withTransaction(async () => {
      const client = await mongoClients.findOne({ _id: clientId }, { session })

      /* const user = */ await mongoUsers.insertOne({
        _id: userInAuth0.user_id,
        username,
        email,
        client,
        schemaVersion: 'v1.1.0'
      }, { session })

      for (const roleId of roles) {
        await mongoRoles.findOneAndUpdate(
          { _id: roleId },
          {
            $push: {
              users: { _id: userInAuth0.user_id, username, email }
            }
          },
          { session }
        )
      }

      // res.json(user.ops[0])
    })
  } catch (error) {
    next(error)
    return
  }

  res.json(userInPsql)
})

subApp.patch('/users/:id', async ({
  params: { id },
  body: { username, email, password, roles },
}, res, next) => {
  if (!username || !email || _.isEmpty(roles)) {
    next('Error: required fields were left blank')
    return
  } else if (username.includes('@')) {
    // TODO: make validation against email address more stringent
    // ! Note: without this check, auth0 will silently fail to update the username
    next('Error: auth0 can\'t accept email address as username')
    return
  }

  let incomingRoles = roles
  if (!Array.isArray(incomingRoles)) incomingRoles = [incomingRoles]

  // ! auth0
  const groupsInAuth0 = await auth0.authClient.getUserGroups(id, false)

  // TODO: Don't use hyphen to determine whether a group is a client group
  // filter out the CLIENT group to only keep the role groups
  // and map to get just the id strings
  const roleGroupsInAuth0 = groupsInAuth0
    .filter(({ name }) => name.includes('-'))
    .map(({ _id }) => _id)

  const doRolesNeedUpdate = _.xor(incomingRoles, roleGroupsInAuth0).length > 0

  try {
    let rolesToLink
    if (doRolesNeedUpdate) {
      const rolesToDelink = roleGroupsInAuth0.filter(
        currentRoleId => !incomingRoles.includes(currentRoleId)
      )

      rolesToLink = incomingRoles.filter(
        incomingRoleId => !roleGroupsInAuth0.includes(incomingRoleId)
      )

      for (const roleToDelink of rolesToDelink) {
        await wait()
        await auth0.authClient.removeGroupMember(roleToDelink, id)
      }

      for (const roleToLink of rolesToLink) {
        await wait()
        await auth0.authClient.addGroupMember(roleToLink, id)
      }
    }

    await wait()
    await auth0.users.update({ id, username, email, password })
  } catch (e) {
    next(e)
    return
  }

  // ! psql
  const user = await User.findByPk(id)
  if (doRolesNeedUpdate) await user.setRoles(incomingRoles)
  await user.update({ username, email })
  const resultingUserWithRolesInPsql = await User.findByPk(id, { include: [{ model: Role }] })

  // ! mongodb
  const session = mongoClient.startSession()

  try {
    let updatedMongoUser

    await session.withTransaction(async () => {
      // 1. update user

      // ! Note: after testing, it looks like 'updateResult' is the original doc, not the updated one
      // ! THIS IS DESPITE WHAT THE DOCS SAY ABOUT { returnNewDocument: true }
      const { value: updateResult } = await mongoUsers.findOneAndUpdate(
        { _id: id },
        { $set: { username, email } },
        { returnNewDocument: true, session }
      )

      updatedMongoUser = updateResult

      // ! Note: We have to do steps 2 and 3 even if role associations aren't changing
      // ! because the user's username and email may have changed
      // 2. pull user from all roles.users they were a part of
      await mongoRoles.updateMany(
        { users: { $elemMatch: { _id: id } } },
        { $pull: { users: { _id: id } } },
        { session }
      )

      // 3. push user into all the roles.users they need to belong to
      await mongoRoles.updateMany(
        { _id: { $in: incomingRoles } }, // query all incoming roles from edit
        {
          $push: { users: { _id: id, username, email } }
        },
        { session }
      )
    })

    // res.json(updatedMongoUser)
  } catch (error) {
    next(error)
    return
  }

  res.json(resultingUserWithRolesInPsql)
})

// ! Maybe Phase 2+: TODO: Delete user's association to role GROUP in auth0
subApp.delete('/users/:id', async ({
  params: { id },
}, res, next) => {
  // ! auth0
  try {
    await auth0.users.delete(id)
  } catch (e) {
    next(e)
    return
  }

  // ! psql
  const userInPsql = await User.findByPk(id)
  await userInPsql.destroy()

  // ! mongodb
  const session = mongoClient.startSession()

  try {
    let deletedUser

    await session.withTransaction(async () => {
      // pull user out of all its roles
      await mongoRoles.updateMany(
        { users: { $elemMatch: { _id: id } } },
        { $pull: { users: { _id: id } } },
        { session }
      )

      // delete user from source collection
      const { value: deletionResult } = await mongoUsers.findOneAndDelete({ _id: id }, { session })
      deletedUser = deletionResult
    })

    // res.json(deletedUser)
  } catch (error) {
    next(error)
    return
  }

  res.json(userInPsql)
})

module.exports = subApp
