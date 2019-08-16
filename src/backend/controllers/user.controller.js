const express = require('express')
const _ = require('lodash')

const wait = require('./../../utils/wait')

module.exports = ({
  // auth0
  auth0,

  // mongo guys
  mongoClient,
  mongoUsers,
  mongoRoles,
  mongoClients,

  // psql stuff
  sequelize,
  User,
  Role,
  Client,
}) => {
  const subApp = express()

  subApp.get('/:userId/roles', async ({
    params: { userId },
  }, res) => {
    const rolesAssociatedWithUser = await mongoRoles.find({ 'users._id': userId }).toArray()

    res.json(rolesAssociatedWithUser)
  })

  subApp.get('/', async (req, res) => {
    const users = await mongoUsers.find().toArray()
    res.json(users)
  })

  subApp.get('/:id', async ({
    params: { id },
  }, res) => {
    const user = await mongoUsers.findOne({ _id: id })
    res.json(user)
  })

  subApp.post('/', async ({
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
    } catch (e) {
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

        const user = await mongoUsers.insertOne({
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

        res.json(user.ops[0])
      })
    } catch (error) {
      next(error)
      return
    }
  })

  subApp.patch('/:id', async ({
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
    await User.findByPk(id, { include: [{ model: Role }] })

    // ! mongodb
    const session = mongoClient.startSession()

    try {
      let updatedMongoUser

      await session.withTransaction(async () => {
        // 1. update user

        // ! Note: Must use { returnOriginal:   false }, which is specific to MongoDB node driver,
        // ! rather than { returnNewDocument: true }
        const { value: updatedResult } = await mongoUsers.findOneAndUpdate(
          { _id: id },
          { $set: { username, email } },
          { returnOriginal: false, session }
        )

        updatedMongoUser = updatedResult

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

      res.json(updatedMongoUser)
    } catch (error) {
      next(error)
      return
    }
  })

  // ! Maybe Phase 2+: TODO: Delete user's association to role GROUP in auth0
  subApp.delete('/:id', async ({
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

    let deletedUser
    try {
      await session.withTransaction(async () => {
        // pull user out of all its roles
        await mongoRoles.updateMany(
          { users: { $elemMatch: { _id: id } } },
          { $pull: { users: { _id: id } } },
          { session }
        )

        // delete user from source collection
        deletedUser = await mongoUsers.findOne({ _id: id })
        await mongoUsers.findOneAndDelete({ _id: id }, { session })
      })
    } catch (error) {
      next(error)
      return
    }

    res.json(deletedUser)
  })

  return subApp
}
