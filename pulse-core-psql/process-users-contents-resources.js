const d3 = require('d3-collection')
const _ = require('lodash')

const rollupResult = (mergedRolesContentsResources, uniqueResources) => {
  const result = []

  _.forEach(mergedRolesContentsResources, (resourcesObj, contentId) => {
    const resourcesForSingleContent = {}
    resourcesForSingleContent.contentId = Number(contentId)
    resourcesForSingleContent.resources = {}

    _.forEach(resourcesObj, (resource, resourceId) => {
      if (resource.type !== 'regionalBreakdown') return // temporary because no other resource types rn
      const uniqueResource = uniqueResources[resourceId]
      resourcesForSingleContent.resources[uniqueResource.type] = uniqueResource.data
    })

    result.push(resourcesForSingleContent)
  })

  return result
}

const getIndividualNestedPermissions = roles_contents => {
  const nestedPermissions = d3.nest()
    .key(d => d.contentId)
    .rollup(arr => {
      return d3.nest()
        .key(d => d.id)
        .rollup(singleResourceArr => singleResourceArr[0])
        .object(arr[0].resources)
    })
    .object(roles_contents)

  return nestedPermissions
}

const nestEachRoleContentsResources = ({ roles }) => (
  roles.map(({ roles_contents }) => getIndividualNestedPermissions(roles_contents))
)

const mergeRolesContentsResources = rolesContentsResources => _.merge({}, ...rolesContentsResources)

const getUniqueResourcesAndFormat = ({
  rawUserContentsResources,
  statesByKey,
  regionsByKey,
}) => {
  const uniqueResourcesAcrossRoles = {}

  rawUserContentsResources.roles.forEach(role => {
    const { roles_contents } = role
    roles_contents.forEach(roleContentAssociation => {
      const { resources } = roleContentAssociation
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
  rawUserContentsResources => {
    const uniqueResources = getUniqueResourcesAndFormat({
      rawUserContentsResources,
      statesByKey,
      regionsByKey,
    })

    const { dataValues: { id: userId, username } } = rawUserContentsResources
    const rolesContentsResources = nestEachRoleContentsResources(rawUserContentsResources)
    const mergedRolesContentsResources = mergeRolesContentsResources(rolesContentsResources)

    const rolledUpResult = rollupResult(mergedRolesContentsResources, uniqueResources)
    const resultWithUserId = rolledUpResult.map(obj => ({ ...obj, userId, username }))

    return resultWithUserId
  }
)

const processRawUsersContentsResources = ({
  rawUsersContentsResources,
  statesByKey,
  regionsByKey,
}) => {
  const processSingleUser = getMapCallback(statesByKey, regionsByKey)
  let result = rawUsersContentsResources.map(processSingleUser)
  result = _.flatten(result)

  return result
}

module.exports = processRawUsersContentsResources
