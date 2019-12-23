const _ = require('lodash')

const wait = require('./../../../../utils/wait')
const upsertUsersSitemaps = require('./../sitemap/upsertUsersSitemaps')
const upsertUsersPermissions = require('./../../../generate-users-permissions/upsertUsersPermissions')

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
    auth0,
    pulseCoreDb,
    pulseDevDb,
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

  let newUser = null
  await session.withTransaction(async () => {
    // Step 1: Insert user into users collection

    const client = await coreClients
      .findOne({ _id: clientId }, { session })

    const user = await pulseCoreDb
      .collection('users')
      .insertOne({
        _id: userInAuth0.user_id,
        username,
        email,
        emailSubscriptions,
        client,
        schemaVersion: 'v1.1.1',
      }, { session })

    newUser = user.ops[0]

    console.log(`\n${ newUser.username } created`)
    
    // Step 2: Add user to selected team's users

    const userTeams = []
    for (const roleId of roles) {
      const { value: team } = await pulseCoreDb
        .collection('roles')
        .findOneAndUpdate(
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
      userTeams.push(team)
    }

    console.log(`${newUser.username} added to ${ userTeams.length } teams`)

    // Step 3: Create a sitemap and resources doc for user

    const sitemapOp = upsertUsersSitemaps({
      users: [newUser],
      session,
      pulseCoreDb,
      pulseDevDb,
    })

    const nodesResourcesOp = upsertUsersPermissions({
      users: [newUser],
      pulseCoreDb,
      pulseDevDb,
      session,
    })

    await Promise.all([
      sitemapOp,
      nodesResourcesOp,
    ])

    console.log(`${ newUser.username } now has sitemap and resource access\n`)
  })

  return newUser
}

module.exports = createUser
