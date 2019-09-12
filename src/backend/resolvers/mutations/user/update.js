const _ = require('lodash')
const wait = require('./../../../../utils/wait')

const updateUser = async (
  parent,
  {
    input: {
      _id,
      username,
      email,
      password,
      roles
    }
  },
  {
    mongoClient,
    coreRoles,
    coreUsers,
    auth0,
  },
  info,
) => {
  if (!username || !email || _.isEmpty(roles)) {
    throw Error('Error: required fields were left blank')
  } else if (username.includes('@')) {
    // TODO: make validation against email address more stringent
    // ! Note: without this check, auth0 will silently fail to update the username
    throw Error('Error: auth0 can\'t accept email address as username')
  }

  let incomingRoles = roles
  if (!Array.isArray(incomingRoles)) incomingRoles = [incomingRoles]

  // ! auth0
  const groupsInAuth0 = await auth0.authClient.getUserGroups(_id, false)

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

    for (const roleToDelink of rolesToDelink) {
      await wait()
      await auth0.authClient.removeGroupMember(roleToDelink, _id)
    }

    for (const roleToLink of rolesToLink) {
      await wait()
      await auth0.authClient.addGroupMember(roleToLink, _id)
    }
  }

  await wait()
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
      { $set: { username, email } },
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
        $push: { users: { _id, username, email } }
      },
      { session }
    )
  })

  return updatedMongoUser
}

module.exports = updateUser
