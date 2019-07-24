const express = require('express')
const _ = require('lodash')

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

subApp.post('/clients', async ({ body: { description } }, res, next) => {
  if (!Boolean(description)) {
    next('text field invalid')
    return
  }

  // write to auth0, which autogenerates a UUID for client
  const clientInAuth0 = await auth0.clients.create({ name: description, description })

  // the create roles method in roles DAO creates both auth0 group and role
  const defaultRoleName = `${description}-admin`
  const defaultRoleDescrip = 'admin'

  const roleInAuth0 = await auth0.roles.create({
    clientId: clientInAuth0._id,
    name: defaultRoleName,
    description: defaultRoleDescrip,
  })

  // use the generated UUID when writing to psql
  const client = await Client.create({
    name: clientInAuth0.name,
    description: clientInAuth0.description,
    id: clientInAuth0._id,
  })

  const defaultRole = await Role.create({
    id: roleInAuth0._id,
    name: roleInAuth0.name,
    description: roleInAuth0.description,
  })

  await client.addRole(defaultRole)

  res.json(client)
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
  body: { description, clientId },
}, res, next) => {

  if (!Boolean(description)) {
    next('text field invalid')
    return
  } else if (!clientId) {
    next('Transaction Rolled Back; ClientId must be specified')
    return
  }

  // auth0
  const { name: clientName } = await auth0.clients.find(clientId)

  const dataObjForAuth0 = {
    clientId,
    name: `${clientName}-${description}`,
    description,
  }

  const roleCreatedInAuth0 = await auth0.roles.create(dataObjForAuth0)

  // Postgres
  const transaction = await sequelize.transaction()

  const role = await Role.create(
    {
      id: roleCreatedInAuth0._id,
      name: roleCreatedInAuth0.name,
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
  body: { description },
}, res) => {
  const roleInAuth0 = await auth0.roles.update({ id, description })

  const roleInPsql = await Role.findByPk(id)

  // TODO: Change description to take in roleInAuth0.description to maintain parity
  const updatedRole = await roleInPsql.update({
    name: roleInAuth0.name,
    description: roleInAuth0.description,
  })

  res.json(updatedRole)
})

// ! NOTE 1: clientId is needed in the body for auth0 side
// ! for severing association between client group and role group
// ! NOTE 2: Phase 2+: TODO: Delete all users who are only associated with the deleted role
subApp.delete('/roles/:id', async ({
  params: { id },
  body: { clientId },
}, res, next) => {
  console.log(clientId);

  if (!Boolean(clientId)) {
    next('must specify clientId')
    return
  }

  // TODO: DOESN'T ACTUALLY DELETE THE ROLE (Removes associations)
  // Reassess what auth0 deletion is actually doing
  await auth0.roles.delete({ id, clientId })

  const role = await Role.findByPk(id)
  await role.destroy()

  res.json(role)
})

subApp.get('/roles/:roleId/users', async ({
  params: { roleId },
}, res) => {
  const role = await Role.findByPk(roleId)

  // get all the users linked to the selected role, but also for each
  // user, get all the roles associated with that individual user
  const roleUsers = await role.getUsers({ include: [{ model: Role }] })

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

  const userInAuth0 = await auth0.users.create({ username, email, password })

  await auth0.authClient.addGroupMember(clientId, userInAuth0.user_id)

  // add the user to potentially multiple roles
  await Promise.all(
    roles.map(roleId => auth0.authClient.addGroupMember(roleId, userInAuth0.user_id))
  )

  const transaction = await sequelize.transaction()

  const userInPsql = await User.create(
    { id: userInAuth0.user_id, username, email },
    { transaction }
  )

  const rolesInPsql = await Role.findAll({ where: { id: roles } }, { transaction })
  await userInPsql.addRoles(rolesInPsql, { transaction })

  transaction.commit()
  res.json(userInPsql)
})

subApp.patch('/users/:id', async ({
  params: { id },
  body: { username, email, password, roles },
}, res, next) => {
  if (!username || !email || _.isEmpty(roles)) {
    next('Error: required fields were left blank')
    return
  }

  let incomingRoles = roles
  if (!Array.isArray(incomingRoles)) incomingRoles = [incomingRoles]

  // AUTH0 WORK
  const groupsInAuth0 = await auth0.authClient.getUserGroups(id, false)

  // TODO: Don't use hyphen to determine whether a group is a client group
  // filter out the CLIENT group to only keep the role groups
  // and map to get just the id strings
  const roleGroupsInAuth0 = groupsInAuth0
    .filter(({ name }) => name.includes('-'))
    .map(({ _id }) => _id)

  const doRolesNeedUpdate = _.xor(incomingRoles, roleGroupsInAuth0).length > 0

  let rolesToLink
  if (doRolesNeedUpdate) {
    const rolesToDelink = roleGroupsInAuth0.filter(
      currentRoleId => !incomingRoles.includes(currentRoleId)
    )

    rolesToLink = incomingRoles.filter(
      incomingRoleId => !roleGroupsInAuth0.includes(incomingRoleId)
    )

    await Promise.all(
      rolesToDelink.map(roleToDelink => auth0.authClient.removeGroupMember(roleToDelink, id))
    )

    await Promise.all(
      rolesToLink.map(roleToLink => auth0.authClient.addGroupMember(roleToLink, id))
    )
  }

  await auth0.users.update({ id, username, email, password })

  // PSQL WORK
  const user = await User.findByPk(id)
  if (doRolesNeedUpdate) await user.setRoles(incomingRoles)
  const updatedUser = await user.update({ username, email })

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
