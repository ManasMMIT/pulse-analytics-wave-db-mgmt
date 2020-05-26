const _ = require('lodash')

const updateTeam = async (
  parent,
  { input: { _id, description, defaultLandingPath } },
  { coreRoles, coreUsers, mongoClient, pulseDevDb },
  info
) => {
  let updatedTeam

  const session = mongoClient.startSession()

  await session.withTransaction(async () => {
    // STEP 1: Update the role; any users affiliated with the role will be updated in step 3
    const {
      value: roleInMongo
    } = await coreRoles.findOneAndUpdate(
      { _id },
      {
        $set: {
          name: description,
          description,
          defaultLandingPath,
        }
      },
      { 
        session, 
        returnOriginal: false 
      },
    )

    updatedTeam = roleInMongo

    // STEP 2: Gather the `_id`s of users who have to be updated
    const usersToUpdate = updatedTeam.users.reduce((acc, { _id: userId, defaultLanding }) => {
      if (_.isEmpty(defaultLanding) || !defaultLanding.locked) {
        acc.push(userId)
      }

      return acc
    }, [])

    // STEP 3: Update target users on this team and in all teams affiliated with those users.
    // This represents the most recently updated team "winning" its users' default landing paths.
    await coreRoles.updateMany(
      { 'users._id': { $in: usersToUpdate } },
      {
        $set: {
          'users.$[user].defaultLanding': {
            path: defaultLandingPath,
            locked: false,
          },
        },
      },
      {
        session,
        arrayFilters: [
          { 'user._id': { $in: usersToUpdate } }
        ]
      }
    )

    // STEP 4: Update core users to match the changes executed in step 3
    await coreUsers.updateMany(
      { _id: { $in: usersToUpdate } },
      {
        $set: {
          defaultLanding: {
            path: defaultLandingPath,
            locked: false,
          }
        }
      },
      { session },
    )

    // STEP 5: Update appropriate users in dev users.sitemaps for defaultLandingPath
    // ! Decision was made not to use 'upsertUsersSitemaps' util here in favor of only
    // ! selectively updating users.sitemaps for `defaultLandingPath`
    const updatedAt = new Date()

    await pulseDevDb.collection('users.sitemaps')
      .updateMany(
        { _id: { $in: usersToUpdate } },
        { 
          $set: { 
            defaultLandingPath,
            updatedAt,
          } 
        },
        { session },
      )
  })

  return updatedTeam
}

module.exports = updateTeam
