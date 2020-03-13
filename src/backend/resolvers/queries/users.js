const _ = require('lodash')

const users = async (
  parent,
  { teamId, clientId, subscriptionId },
  { coreUsers, coreRoles }
) => {
  let queryObj = {}
  if (Boolean(clientId)) _.merge(queryObj, { 'client._id': clientId })
  if (Boolean(teamId)) _.merge(queryObj, { _id: teamId })

  if (!clientId && !teamId) {
    if (subscriptionId) {
      queryObj = { 'emailSubscriptions._id': subscriptionId }
    }

    const usersResult = await coreUsers.find(queryObj).toArray()
    return usersResult
  }

  const roles = await coreRoles.find(queryObj).toArray()

  // if filtering 'roles' collection by client, there could be multiple roles
  // with the same user belonging to more than one of them
  const uniqueUsersAcrossRoles = _.uniqBy(
    _.flatten(roles.map(({ users }) => users)),
    '_id'
  )

  const result = _.sortBy(
    uniqueUsersAcrossRoles,
    ({ username }) => username.toLowerCase()
  )

  return result
}

module.exports = users
