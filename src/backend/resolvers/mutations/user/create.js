const _ = require('lodash')
const wait = require('./../../../../utils/wait')

const createUser = async (
  parent,
  {
    input: {
      username,
      email,
      password,
      clientId,
      roles,
      emailSubscriptions,
    }
  },
  {
    mongoClient,
    coreClients,
    coreRoles,
    coreUsers,
    auth0,
  },
  info,
) => {
  if (!Boolean(username)) {
    throw Error('username field invalid')
  } else if (username.includes(' ')) {
    throw Error ('username cannot have spaces')
  } else if (!Boolean(email)) {
    throw Error('email field invalid')
  } else if (_.isEmpty(roles) || !Array.isArray(roles)) {
    throw Error('must specify at least one role in an array')
  }

  // ! auth0
  const userInAuth0 = await auth0.users.create({ username, email, password })

  await wait()
  await auth0.authClient.addGroupMember(clientId, userInAuth0.user_id)

  for (const roleId of roles) {
    await wait()
    await auth0.authClient.addGroupMember(roleId, userInAuth0.user_id)
  }

  // ! mongodb
  const session = mongoClient.startSession()

  let result = null
  await session.withTransaction(async () => {
    const client = await coreClients.findOne({ _id: clientId }, { session })

    const user = await coreUsers.insertOne({
      _id: userInAuth0.user_id,
      username,
      email,
      emailSubscriptions,
      client,
      schemaVersion: 'v1.1.1',
    }, { session })

    for (const roleId of roles) {
      await coreRoles.findOneAndUpdate(
        { _id: roleId },
        {
          $push: {
            users: {
              _id: userInAuth0.user_id,
              username,
              email,
              emailSubscriptions,
            }
          }
        },
        { session }
      )
    }

    result = user.ops[0]
  })

  return result
}

module.exports = createUser
