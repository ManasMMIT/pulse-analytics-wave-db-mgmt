const _ = require('lodash')

const users = async (parent, { teamId, clientId }, { pulseCoreDb }) => {
  const queryObj = {}
  if (Boolean(clientId)) _.merge(queryObj, { 'client._id': clientId })
  if (Boolean(teamId)) _.merge(queryObj, { _id: teamId })

  const roles = await pulseCoreDb.collection('roles').find(queryObj).toArray()

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
