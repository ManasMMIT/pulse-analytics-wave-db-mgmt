const d3 = require('d3-collection')
const _ = require('lodash')

const rollupResult = (mergedRolesNodesResources, uniqueResources) => {
  const result = []

  _.forEach(mergedRolesNodesResources, (resourcesObj, nodeId) => {
    const resourcesForSingleNode = {}
    resourcesForSingleNode.nodeId = nodeId
    resourcesForSingleNode.resources = {}

    _.forEach(resourcesObj, (resource, resourceId) => {
      if (resource.type !== 'regionalBreakdown') return // temporary because no other resource types rn
      const uniqueResource = uniqueResources[resourceId]
      resourcesForSingleNode.resources[uniqueResource.type] = uniqueResource.data
    })

    result.push(resourcesForSingleNode)
  })

  return result
}

const getIndividualNestedPermissions = roles_nodes => {
  const nestedPermissions = d3.nest()
    .key(d => d.nodeId)
    .rollup(arr => {
      return d3.nest()
        .key(d => d.id)
        .rollup(singleResourceArr => singleResourceArr[0])
        .object(arr[0].resources)
    })
    .object(roles_nodes)

  return nestedPermissions
}

const nestEachRoleNodesResources = ({ roles }) => (
  roles.map(({ roles_nodes }) => getIndividualNestedPermissions(roles_nodes))
)

const mergeRolesNodesResources = rolesNodesResources => _.merge({}, ...rolesNodesResources)

const getUniqueResourcesAndFormat = ({
  rawUserNodesResources,
  statesByKey,
  regionsByKey,
}) => {
  const uniqueResourcesAcrossRoles = {}

  rawUserNodesResources.roles.forEach(role => {
    const { roles_nodes } = role
    roles_nodes.forEach(roleNodeAssociation => {
      const { resources } = roleNodeAssociation
      resources.forEach(resource => {
        if (resource.type !== 'regionalBreakdown') return // temporary because no other resource types ready rn

        if (!uniqueResourcesAcrossRoles[resource.id]) {
          let regionalBreakdown = resource.regionalBreakdown.toJSON().bsr

          regionalBreakdown = regionalBreakdown.map(obj => {
            const stateData = statesByKey[obj.stateId].toJSON()
            const regionData = regionsByKey[obj.regionId].toJSON()

            return {
              region: regionData.name,
              ...stateData,
            }
          })

          uniqueResourcesAcrossRoles[resource.id] = {
            id: resource.id,
            type: resource.type,
            data: regionalBreakdown,
          }
        }
      })
    })
  })

  return uniqueResourcesAcrossRoles
}

const getMapCallback = (statesByKey, regionsByKey) => (
  rawUserNodesResources => {
    const uniqueResources = getUniqueResourcesAndFormat({
      rawUserNodesResources,
      statesByKey,
      regionsByKey,
    })

    const { dataValues: { id: userId, username } } = rawUserNodesResources
    const rolesNodesResources = nestEachRoleNodesResources(rawUserNodesResources)
    const mergedRolesNodesResources = mergeRolesNodesResources(rolesNodesResources)

    const rolledUpResult = rollupResult(mergedRolesNodesResources, uniqueResources)
    const resultWithUserId = rolledUpResult.map(obj => ({ ...obj, userId, username }))
    return resultWithUserId
  }
)

const processUsersNodesResources = ({
  rawUsersNodesResources,
  statesByKey,
  regionsByKey,
}) => {
  const processSingleUser = getMapCallback(statesByKey, regionsByKey)
  let result = rawUsersNodesResources.map(processSingleUser)
  result = _.flatten(result)

  return result
}

module.exports = processUsersNodesResources
