const _ = require('lodash')

const mergeSitemapsAcrossRoles = (roles, rolesSitemapsMap) => {
  // deep copy the rolesSitemapsMap slice to avoid mutating it and
  // messing up that slice for other users
  const result = _.merge({}, rolesSitemapsMap[roles[0].id])

  const [{ kids: toolsAccumulator }] = Object.values(result.kids)

  roles.slice(1).forEach(({ id }) => {
    const [{ kids: toolsForRole }] = Object.values(rolesSitemapsMap[id].kids)

    // mutate the toolsAccumlator; this also mutates result
    _.merge(toolsAccumulator, toolsForRole)
  })

  return result
}

module.exports = mergeSitemapsAcrossRoles
