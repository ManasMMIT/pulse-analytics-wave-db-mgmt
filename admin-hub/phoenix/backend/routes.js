const express = require('express')

// ? temporary until we change the user model via sequelize migration
const uuid = require('uuid/v4')

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
  // auth0.clients.find(id)
  const client = await Client.findByPk(params.id)

  res.json(client)
})

subApp.post('/clients', async ({
  body: { name, description },
}, res) => {
  if (!Boolean(name)) {
    res.send('A name value is required when creating a client')
    return
  }
  const client = await Client.create({ name, description })
    // .then(client => {
      // auth0.clients.create(client)
    // })
  res.json(client)
})

subApp.patch('/clients/:id', async ({
  params: { id },
  body: {
    name,
    description,
  },
}, res) => {
  // auth0.clients.update(id)
  if (!Boolean(name)) {
    res.send('name field invalid')
    return
  } else if (!Boolean(description)) {
    res.send('description field invalid')
    return
  }

  const client = await Client.findByPk(id)

  if (!Boolean(client)) {
    res.send(`client with id ${ id } doesn't exist`)
    return
  }

  await client.update({
    name,
    description,
  })

  res.json(client)
})

subApp.delete('/clients/:id', async ({
  params: { id },
}, res) => {
  // auth0.clients.delete(id)
  const client = await Client.findByPk(id)
  await client.destroy()

  res.send(`${ client.name } roasted by the Phoenix`)
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
  // auth0.roles.find()
  const roles = await Role.findAll()

  res.json(roles)
})

subApp.get('/roles/:id', async ({
  params: { id },
}, res) => {
  // auth0.roles.find()
  const role = await Role.findByPk(id)

  res.json(role)
})

// TODO: Wrap in transaction
subApp.post('/roles', async ({
  body: { name, description, clientId },
}, res) => {
  if (!Boolean(name)) {
    res.send('name field invalid')
    return
  }
  // auth0.roles.find()
  const clientIdArr = clientId
    ? [clientId]
    : null

  const role = await sequelize.transaction(t => {
    return Role.create({
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
  .catch(err => res.send(err))
  // const role = await Role.create({ name, description })

  // await role.setClients([clientId])
  res.json(role)
})

subApp.patch('/roles/:id', async ({
  params: { id },
  body: { name, description },
}, res) => {
  // auth0.roles.find()
  
  const role = await Role.findByPk(id)

  await role.update({ name, description })

  res.json(role)
})

subApp.delete('/roles/:id', async ({
  params: { id },
}, res) => {
  // auth0.roles.find()
  const role = await Role.findByPk(id)

  await role.destroy(id)

  res.send(`${ role.name } role torched by the Phoenix`)
})

subApp.get('/roles/:roleId/users', async ({
  params: { roleId },
}, res) => {
  // auth0.users.find()
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
  // auth0.users.find()
  const users = await User.findAll()

  res.json(users)
})

subApp.get('/users/:id', async ({
  params: { id },
}, res) => {
  // auth0.users.find()
  const user = await User.findByPk(id)

  res.json(user)
})

subApp.post('/users', async ({
  body: { username },
}, res) => {
  // create own uuid for user and save in psql and auth0
  // auth0.users.find()
  if (!Boolean(username)) {
    res.send('username field invalid')
    return
  }
  const id = uuid()
  const user = await User.create({ id, username })

  res.json(user)
})

subApp.patch('/users/:id', async ({
  params: { id },
  body: { username },
}, res) => {
  // auth0.users.find()
  const user = await User.findByPk(id)

  await user.update({ username })

  res.json(user)
})

subApp.delete('/users/:id', async ({
  params: { id },
}, res) => {
  // auth0.users.find()
  const user = await User.findByPk(id)

  await user.destroy()

  res.send(`${ user.username } fell prey to the Phoenix`)
})

module.exports = subApp
