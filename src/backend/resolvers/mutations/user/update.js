const _ = require('lodash')

const upsertUsersPermissions = require('../sitemap/permissions-upsertion/upsertUsersPermissions')
const upsertUsersSitemaps = require('../sitemap/upsertUsersSitemaps')

const updateUser = async (
  parent,
  {
    input: {
      _id,
      username,
      email,
      password,
      roles,
      emailSubscriptions,
      defaultLanding,
    },
  },
  { mongoClient, coreRoles, coreUsers, auth0, pulseDevDb, pulseCoreDb },
  info
) => {
  username = username.trim()
  email = email.trim()

  if (!Boolean(username) || !Boolean(email)) {
    throw Error("username and/or email fields can't be blank")
  } else if (username.includes(' ') || email.includes(' ')) {
    throw Error('username and/or email cannot have spaces')
  } else if (username.includes('@')) {
    // TODO: make validation against email address more stringent
    // ! Note: without this check, auth0 will silently fail to update the username
    throw Error("Error: auth0 can't accept email address as username")
  } else if (_.isEmpty(roles) || !Array.isArray(roles)) {
    throw Error('must specify at least one role in an array')
  }

  let incomingRoles = roles
  if (!Array.isArray(incomingRoles)) incomingRoles = [incomingRoles]

  // ! auth0
  await auth0.users.update({ id: _id, username, email, password })

  // ! mongodb
  const session = mongoClient.startSession()

  let updatedMongoUser

  await session.withTransaction(async () => {
    // 1. update user

    // ! Note: Must use { returnOriginal:   false }, which is specific to MongoDB node driver,
    // ! rather than { returnNewDocument: true }
    const { value: updatedResult } = await coreUsers.findOneAndUpdate(
      { _id },
      {
        $set: {
          username,
          email,
          emailSubscriptions,
          defaultLanding,
        },
      },
      { returnOriginal: false, session }
    )

    updatedMongoUser = updatedResult

    // ! Note: We have to do steps 2 and 3 even if role associations aren't changing
    // ! because the user's username and email may have changed
    // 2. pull user from all roles.users they were a part of
    await coreRoles.updateMany(
      { users: { $elemMatch: { _id } } },
      { $pull: { users: { _id } } },
      { session }
    )

    // 3. push user into all the roles.users they need to belong to
    await coreRoles.updateMany(
      { _id: { $in: incomingRoles } }, // query all incoming roles from edit
      {
        $push: {
          users: {
            _id,
            username,
            email,
            emailSubscriptions,
            defaultLanding,
          },
        },
      },
      { session }
    )

    // 4. Update a user's sitemap and resources docs
    const sitemapOp = upsertUsersSitemaps({
      users: [updatedMongoUser],
      session,
      pulseDevDb,
      pulseCoreDb,
    })

    const nodesResourcesOp = upsertUsersPermissions({
      users: [updatedMongoUser],
      pulseDevDb,
      pulseCoreDb,
      session,
    })

    await Promise.all([sitemapOp, nodesResourcesOp])
  })

  return updatedMongoUser
}

module.exports = updateUser
