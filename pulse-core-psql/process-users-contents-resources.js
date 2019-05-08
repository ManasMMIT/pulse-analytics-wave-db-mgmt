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

const getIndividualNestedPermissions = permissions => {
  const nestedPermissions = d3.nest()
    .key(d => d.contentId)
    .key(d => d.resourceId)
    .rollup(arr => arr[0].resource.toJSON())
    .object(permissions)

  return nestedPermissions
}

const nestEachRoleContentsResources = ({ roles }) => (
  roles.map(({ permissions }) => getIndividualNestedPermissions(permissions))
)

const mergeRolesContentsResources = rolesContentsResources => _.merge({}, ...rolesContentsResources)

const getUniqueResourcesAndFormat = ({
  rawUserContentsResources,
  statesByKey,
  regionsByKey,
}) => {
  const allPermissions = rawUserContentsResources.roles.map(({ permissions }) => permissions)
  const flattenedPermissions = _.flatten(allPermissions)
  const permUniquedByResource = _.uniqBy(flattenedPermissions, ({ resource: { id } }) => id)

  const uniqueResources = permUniquedByResource
    .filter(({ resource: { type } }) => type === 'regionalBreakdown') // temporary because no other resource types rn
    .map(({ resource }) => {
      let regionalBreakdown = resource.regionalBreakdown.toJSON().bsr
      regionalBreakdown = regionalBreakdown.map(obj => {
        const stateData = statesByKey[obj.stateId].toJSON()
        const regionData = regionsByKey[obj.regionId].toJSON()

        return {
          region: regionData.name,
          ...stateData,
        }
      })

      return {
        id: resource.id,
        type: resource.type,
        data: regionalBreakdown,
      }
    })

  const keyedResources = _.keyBy(uniqueResources, 'id')

  return keyedResources
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
