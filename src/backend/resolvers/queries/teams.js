const _ = require('lodash')

const teams = async (parent, { clientId, userId }, { pulseCoreDb }) => {
  const queryObj = {}
  if (Boolean(clientId)) _.merge(queryObj, { 'client._id': clientId })
  if (Boolean(userId)) _.merge(queryObj, { 'users._id': userId })

  // TODO: Fix this special casing for query coming from user creation form.
  // ! Need to return an empty array, otherwise all teams fetched, and create
  // ! form doesn't properly render.
  if (!clientId && userId === null) return []

  const teams = await pulseCoreDb
    .collection('roles')
    .find(queryObj)
    .toArray()

  const [[adminRole], restOfRoles] = _.partition(
    teams,
    ({ name }) => name.includes('-admin')
  )

  if (adminRole) adminRole.isDefault = true

  const sortedOtherRoles = _.sortBy(
    restOfRoles,
    ({ description }) => description.toLowerCase()
  )

  const result = _.compact([adminRole, ...sortedOtherRoles])
    
  return result
}

module.exports = teams
