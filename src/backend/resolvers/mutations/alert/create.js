const _ = require('lodash')

const addUsersToDb = async ({ mongoClient, pulseDevDb, clientsData }) => {
  const { existingClients, newClients } = clientsData

  const session = mongoClient.startSession()

  try {
    await session.withTransaction(async () => {
      if (!_.isEmpty(existingClients)) {
        for (const [clientName, clientObj] of Object.entries(existingClients)) {
          const { users } = clientObj
          await pulseDevDb
            .collection('temp.teams')
            .findOneAndUpdate(
              { _id: 'meta' },
              { $addToSet: { [`${clientName}.users`]: { $each: users } } },
              { session }
            )
        }
      }
  
      if (!_.isEmpty(newClients)) {
        for (const [clientName, clientObj] of Object.entries(newClients)) {
          await pulseDevDb
            .collection('temp.teams')
            .findOneAndUpdate(
              { _id: 'meta' },
              { $set: { [clientName]: clientObj } },
              { session }
            )
        }
      }
    })

    console.log(`Successfully added users`)
  } catch (e) {
    console.log('Failed to add users, try again?')
    console.log(e)
  }
}

const createEmailUsers = async (
  parent,
  { input: { users } },
  { mongoClient, pulseDevDb }
) => {
  const errors = []
  
  // collect all of the usernames from the provided users data
  const usernames = users.map(({ username }) => username)
  // use the array of users to filter the collection by teams with those usernames
  let usersTeams = await pulseDevDb
    .collection('temp.teams')
    .find({
      $or: [{ 'users.username': { $in: usernames } }, { _id: 'meta' }],
    })
    .toArray()

  const metaDoc = _.keyBy(usersTeams, '_id')['meta'] //extract meta document from data

  // grab all of the teams and then combine them by client
  const clientsWithUsers = usersTeams.reduce((acc, team) => {
    if (team._id === 'meta') return acc

    const { users, client: { name, description } } = team
    const usersKeyByUsername = _.keyBy(users, 'username')

    if (acc[name]) {
      acc[name].users = { ...acc[name].users, ...usersKeyByUsername }
    } else {
      acc[name] = { users: usersKeyByUsername, description }
    }

    return acc
  }, {})
  
  // iterate through all of the provided users
  // 1. get their information
  // 2. if they can be added to the email list without errors add them to the result array
  const clientsData = users.reduce((acc, user) => {
    const { username, email } = user
    let userInfo
    
    for (const [clientName, clientObj] of Object.entries(clientsWithUsers)) {
      const { users } = clientObj
      if (users[username]) {
        if (email){
          userInfo = { client: clientName, ...users[username], ...user }
        } else {
          userInfo = { client: clientName, ...users[username] }
        }
        break
      }
    }

    if (!userInfo) {
      errors.push(
        `Error: no team found for ${ username }, did you spell it correctly?`
      )
      return acc
    }
    
    const { client } = userInfo
    const clientKey = !metaDoc[client] ? 'newClients' : 'existingClients'

    if (acc[clientKey][client]) {
      acc[clientKey][client].users.push(userInfo)
    } else {
      acc[clientKey][client] = {
        users: [userInfo],
        description: clientsWithUsers[client].description,
      }
    }

    return acc
  }, { existingClients: {}, newClients: {} })

  await addUsersToDb({ mongoClient, pulseDevDb, clientsData })
  if (!_.isEmpty(errors)) console.log(errors)

  return errors
}

module.exports = createEmailUsers
