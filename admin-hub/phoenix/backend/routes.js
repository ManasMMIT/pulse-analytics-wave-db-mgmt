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

subApp.post('/clients', async ({ body: { name, description } }, res, next) => {
  if (!Boolean(name)) {
    next('A name value is required when creating a client')
    return
  }

  // write to auth0, which autogenerates a UUID for client
  const clientInAuth0 = await auth0.clients.create({ name, description })
  // TODO: Create default admin subgroup in auth0
  // TODO: Create default admin role in auth0

  // use the generated UUID when writing to psql
  const client = await Client.create({ name, description, id: clientInAuth0._id })

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

subApp.delete('/clients/:id', async ({
  params: { id },
}, res) => {
  await auth0.clients.delete(id)
  // TODO: Delete all teams, comprising associated subgroups and roles in auth0
  // TODO: Delete all associated users in auth0

  const client = await Client.findByPk(id)
  await client.destroy()

  res.json(client)
})

subApp.get('/clients/:clientId/roles', async ({
  params: { clientId },
}, res) => {
  const client = await Client.findByPk(clientId)
  const clientRoles = await client.getRoles()

  res.json(clientRoles)
})

subApp.get('/roles/:roleId/clients', async ({
  params: { roleId },
}, res) => {
  const role = await Role.findByPk(roleId)
  const roleClients = await role.getClients()

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

// TODO: Wrap sequelize work in transaction
subApp.post('/roles', async ({
  body: { name, description, clientId },
}, res, next) => {
  if (!Boolean(name)) {
    next('name field invalid')
    return
  }

  const { name: clientName } = await auth0.clients.find(clientId)

  const dataObjForAuth0 = {
    clientId,
    name: `${clientName}-${name}`,
    description: name,
  }

  const roleCreatedInAuth0 = await auth0.roles.create(dataObjForAuth0)

  const clientIdArr = clientId
    ? [clientId]
    : null

  const role = await sequelize.transaction(t => {
    return Role.create({
      id: roleCreatedInAuth0._id,
      name,
      description,
    }, {transaction: t})
    .then(role => {
      role.setClients(
        [clientId],
        { transaction: t }
      )
      return role
    })
  })
  .then(role => role)
  .catch(next)

  // const role = await Role.create({ name, description })

  // await role.setClients([clientId])
  res.json(role)
})

subApp.patch('/roles/:id', async ({
  params: { id },
  body: { name },
}, res) => {
  const updatedRole = await auth0.roles.update({ id, name })

  const role = await Role.findByPk(id)
  await role.update({ name, description: updatedRole.description })

  res.json(role)
})

// ! NOTE: clientId is needed in the body for auth0 side
// for severing association between client group and role group
subApp.delete('/roles/:id', async ({
  params: { id },
  body: { clientId },
}, res, next) => {
  if (!Boolean(clientId)) {
    next('must specify clientId')
    return
  }

  await auth0.roles.delete({ id, clientId })
  // TODO: Delete all users who are only associated with this role

  const role = await Role.findByPk(id)
  await role.destroy(id)

  res.json(role)
})

subApp.get('/roles/:roleId/users', async ({
  params: { roleId },
}, res) => {
  const role = await Role.findByPk(roleId)
  const roleUsers = await role.getUsers()

  res.json(roleUsers)
})

subApp.get('/users/:userId/roles', async ({
  params: { userId },
}, res) => {
  const user = await User.findByPk(userId)
  const userRoles = await user.getRoles()

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
  body: { username, email, password },
}, res, next) => {
  if (!Boolean(username)) {
    next('username field invalid')
    return
  }

  const userInAuth0 = await auth0.users.create({ username, email, password })
  // TODO: add the user to the auth0 client group
  // TODO: add the user to the auth0 role group (but not the actual 'role' in auth0)

  const user = await User.create({ id: userInAuth0.user_id, username })

  res.json(user)
})

subApp.patch('/users/:id', async ({
  params: { id },
  body: { username, email, password },
}, res) => {
  await auth0.users.update({ id, username, email, password })

  // TODO: Is there a sequelize find and update method?
  const user = await User.findByPk(id)
  const updatedUser = await user.update({ username })

  res.json(updatedUser)
})

subApp.delete('/users/:id', async ({
  params: { id },
}, res) => {
  await auth0.users.delete(id)
  // TODO: Delete user's association to role GROUP in auth0

  const user = await User.findByPk(id)
  await user.destroy()

  res.json(user)
})

module.exports = subApp
