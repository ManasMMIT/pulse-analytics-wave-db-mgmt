const _ = require('lodash')

module.exports = resources => {
  const dupedResources = resources.map(_.cloneDeep)

  const combinedResources = {}

  dupedResources.forEach(resourcesObj => {
    for (const resourceType in resourcesObj) {
      if (!combinedResources[resourceType]) {
        combinedResources[resourceType] = resourcesObj[resourceType]
      } else {
        const combinedPermission = combinedResources[resourceType].concat(resourcesObj[resourceType])

        const uniqueCombinedPermission = typeof combinedPermission[0] === 'object'
          ? _.uniqBy(combinedPermission, '_id')
          : _.uniq(combinedPermission)

        const sortedCombinedPermission = typeof uniqueCombinedPermission[0] === 'object'
          ? _.sortBy(uniqueCombinedPermission, ({ name }) => name && name.toLowerCase())
          : _.sortBy(uniqueCombinedPermission)

        combinedResources[resourceType] = sortedCombinedPermission
      }
    }
  })
  const resourcesWithRegionalBreakdowns = dupedResources
    .filter(({ regionalBreakdown }) => regionalBreakdown)

  if (resourcesWithRegionalBreakdowns.length) {
    combinedResources.regionalBreakdown = resourcesWithRegionalBreakdowns[0].regionalBreakdown
  }

  return combinedResources
}
