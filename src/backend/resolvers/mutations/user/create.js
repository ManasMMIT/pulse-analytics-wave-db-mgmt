const _ = require('lodash')

const upsertUsersSitemaps = require('../sitemap/sitemaps-upsertion/upsertUsersSitemaps')
const upsertUsersPermissions = require('../sitemap/permissions-upsertion/upsertUsersPermissions')

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
  username = username.trim()
  email = email.trim()

  if (!Boolean(username) || !Boolean(email)) {
    throw Error('username and/or email fields can\'t be blank')
  } else if (username.includes(' ') || email.includes(' ')) {
    throw Error ('username and/or email cannot have spaces')
  } else if (username.includes('@')) {
    // TODO: make validation against email address more stringent
    // ! Note: without this check, auth0 will silently fail to update the username
    throw Error('Error: auth0 can\'t accept email address as username')
  } else if (_.isEmpty(roles) || !Array.isArray(roles)) {
    throw Error('must specify at least one role in an array')
  }

  // ! auth0
  const userInAuth0 = await auth0.users.create({ username, email, password })

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
