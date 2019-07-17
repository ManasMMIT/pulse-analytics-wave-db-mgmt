const express = require('express')

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

subApp.get('/clients', async (req, res) => {
  const clients = await Client.findAll()
  res.json(clients)
})

subApp.get('/clients/:id', async ({ params }, res) => {
  const client = await Client.findByPk(params.id)
  res.json(client)
})

subApp.post('/clients', async ({ body: { name } }, res, next) => {
  if (!Boolean(name)) {
    next('A name value is required when creating a client')
    return
  }

  // write to auth0, which autogenerates a UUID for client
  const clientInAuth0 = await auth0.clients.create({ name, description: name })

  // the create roles method in roles DAO creates both auth0 group and role
  const defaultRoleName = `${name}-admin`
  const defaultRoleDescrip = 'admin'

  await auth0.roles.create({
    clientId: clientInAuth0._id,
    name: defaultRoleName,
    description: defaultRoleDescrip,
  })

  // use the generated UUID when writing to psql
  const client = await Client.create({
    name,
    description: clientInAuth0.description,
    id: clientInAuth0._id
  })

  await Role.create({
    name: defaultRoleName,
    description: defaultRoleDescrip,
  })

  res.json(client)
})

subApp.patch('/clients/:id', async ({
  params: { id },
  body: {
    name,
    description,
  },
}, res, next) => {
  if (!Boolean(name)) {
    next('name field invalid')
    return
  } else if (!Boolean(description)) {
    next('description field invalid')
    return
  }

  const client = await Client.findByPk(id)

  if (!Boolean(client)) {
    next(`client with id ${ id } doesn't exist`)
    return
  }

  await auth0.clients.update({
    id,
    name,
    description,
  })

  const updatedClient = await client.update({
    name,
    description,
  })

  res.json(updatedClient)
})

// ! Phase 2+ todos
// TODO: Delete all teams, comprising associated subgroups and roles in auth0, psql
// TODO: Delete all associated users in auth0, psql
subApp.delete('/clients/:id', async ({
  params: { id },
}, res) => {
  await auth0.clients.delete(id)

  const client = await Client.findByPk(id)
  await client.destroy()

  res.json(client)
})

subApp.get('/clients/:clientId/roles', async ({
  params: { clientId },
}, res) => {
  const client = await Client.findByPk(clientId)
  const clientRoles = await client.getRoles({ raw: true })

  res.json(clientRoles)
})

subApp.get('/roles/:roleId/clients', async ({
  params: { roleId },
}, res) => {
  const role = await Role.findByPk(roleId)
  const roleClients = await role.getClients({ raw: true })

  res.json(roleClients)
})

subApp.get('/roles', async (req, res) => {
  const roles = await Role.findAll()
  res.json(roles)
})

subApp.get('/roles/:id', async ({
  params: { id },
}, res) => {
  const role = await Role.findByPk(id)
  res.json(role)
})

subApp.post('/roles', async ({
  body: { name, clientId },
}, res, next) => {

  if (!Boolean(name)) {
    next('name field invalid')
    return
  } else if (!clientId) {
    next('Transaction Rolled Back; ClientId must be specified')
    return
  }

  const transaction = await sequelize.transaction()

  // auth0
  const { name: clientName } = await auth0.clients.find(clientId)

  const dataObjForAuth0 = {
    clientId,
    name: `${clientName}-${name}`,
    description: name,
  }

  const roleCreatedInAuth0 = await auth0.roles.create(dataObjForAuth0)

  // Postgres
  const role = await Role.create(
    {
      id: roleCreatedInAuth0._id,
      name,
      description: roleCreatedInAuth0.description // follow auth0 weird casing coercion
    },
    { transaction }
  )

  const client = await Client.findByPk(clientId, { transaction })
  await role.addClient(client, { transaction })

  transaction.commit()

  res.json(role)
})

// NOTE: assumption: a role's association with a client is never updated
subApp.patch('/roles/:id', async ({
  params: { id },
  body: { name },
}, res) => {
  const updatedRole = await auth0.roles.update({ id, name })

  await role.update(
    { name: updatedRole.name, description: name },
    { where: { id } }
  )

  res.json(role)
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

  await auth0.roles.delete({ id, clientId })

  const role = await Role.findByPk(id)
  await role.destroy()

  res.json(role)
})

subApp.get('/roles/:roleId/users', async ({
  params: { roleId },
}, res) => {
  const role = await Role.findByPk(roleId)
  const roleUsers = await role.getUsers({ raw: true })

  res.json(roleUsers)
})

subApp.get('/users/:userId/roles', async ({
  params: { userId },
}, res) => {
  const user = await User.findByPk(userId)
  const userRoles = await user.getRoles({ raw: true })

  res.json(userRoles)
})

subApp.get('/users', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

subApp.get('/users/:id', async ({
  params: { id },
}, res) => {
  const user = await User.findByPk(id)
  res.json(user)
})

subApp.post('/users', async ({
  body: { username, email, password, clientId, roleId },
}, res, next) => {

  if (!Boolean(username)) {
    next('username field invalid')
    return
  } else if (!Boolean(roleId)) {
    next('user must belong to at least one role')
    return
  }

  const transaction = await sequelize.transaction()

  const userInAuth0 = await auth0.users.create({ username, email, password })
  await auth0.authClient.addGroupMember(clientId, userInAuth0.user_id)
  await auth0.authClient.addGroupMember(roleId, userInAuth0.user_id)

  const user = await User.create({ id: userInAuth0.user_id, username }, { transaction })
  const role = await Role.findByPk(roleId, { transaction })

  await user.addRole(role, { transaction })

  transaction.commit()
  res.json(user)
})

subApp.patch('/users/:id', async ({
  params: { id },
  body: { username, email, password },
}, res) => {
  await auth0.users.update({ id, username, email, password })

  const updatedUser = await User.update({ username }, { where: { id } })
  res.json(updatedUser)
})

// ! Maybe Phase 2+: TODO: Delete user's association to role GROUP in auth0
subApp.delete('/users/:id', async ({
  params: { id },
}, res) => {
  await auth0.users.delete(id)

  const user = await User.findByPk(id)
  await user.destroy()

  res.json(user)
})

module.exports = subApp
