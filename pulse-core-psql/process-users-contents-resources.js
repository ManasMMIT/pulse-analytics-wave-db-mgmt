const d3 = require('d3-collection')
const _ = require('lodash')

const processSingleUserContentsResources = UserContentsResources => {
  const { dataValues: { id: _id, username } } = UserContentsResources
  const rolesContentsResources = nestEachRoleContentsResources(UserContentsResources)
  const mergedRolesContentsResources = mergeRolesContentsResources(rolesContentsResources)
  const formattedSitemap = formatSitemap(mergedRolesContentsResources)

  return {
    _id,
    username,
    sitemap: formattedSitemap
  }
}

const processUsersContentsResourcesRaw = UsersContentsResourcesRaw => {
  const UsersContentsResources = UsersContentsResourcesRaw.map(processSingleUserContentsResources)
  return UsersContentsResources
}

module.exports = processUsersContentsResourcesRaw
