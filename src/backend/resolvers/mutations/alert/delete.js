const _ = require('lodash')

const removeUsersFromDb = async ({ mongoClient, pulseDevDb, clientsData }) => {
  const session = mongoClient.startSession()

  try {
    await session.withTransaction(async () => {
      if (!_.isEmpty(clientsData)) {
        for (const [clientName, clientUsers] of Object.entries(clientsData)) {
          await pulseDevDb
            .collection('temp.teams')
            .findOneAndUpdate(
              { _id: 'meta' },
              {
                $pull: {
                  [`${ clientName }.users`]: { email: { $in: clientUsers } },
                },
              },
              { session }
            )
        }
      }
    })
    console.log(`Successfully removed users`)
  } catch (e) {
    console.log('Failed to delete users, try again?')
    console.log(e)
  }
}

const deleteEmailUsers = async (
  parent,
  { input: { users } },
  { mongoClient, pulseDevDb }
) => {
  const errors = []
  
  let metaDoc = await pulseDevDb
    .collection('temp.teams')
    .find({ _id: 'meta' })
    .toArray()

  const allUsersWithAlerts = Object.values(metaDoc[0]).reduce((acc, { users }) => {
    if (users) acc.push(...users)
    return acc
  }, [])

  const usersGroupByUsername = _.groupBy(allUsersWithAlerts, 'username')
  const usersGroupByEmail = _.groupBy(allUsersWithAlerts, 'email')
  
  const clientsData = users.reduce((acc, user) => {
    const { username } = user
    const userInfo = username.includes('@') ? usersGroupByEmail[username] : usersGroupByUsername[username]
    
    if (!userInfo) {
      errors.push(
        `Error: ${username} is currently not receiving alerts, did you spell their username correctly?`
      )
      return acc
    }

    userInfo.forEach((clientObj) => {
      const { client, email } = clientObj
      if (acc[client]) {
        acc[client].push(email)
      } else {
        acc[client] = [email]
      }
    })

    return acc
  }, {})

  await removeUsersFromDb({ mongoClient, pulseDevDb, clientsData })
  if (!_.isEmpty(errors)) console.log(errors)

  return errors
}

module.exports = deleteEmailUsers
