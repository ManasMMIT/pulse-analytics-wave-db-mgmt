const d3 = require('d3-collection')
const _ = require('lodash')

const getGroupByKey = obj => {
  const tableName = obj._modelOptions.name.plural

  let order
  if (tableName === 'contents') {
    // TODO: content table doesn't actually need order in the key string
    // because that can be extracted from the contentObj directly
    order = obj.roles_contents.toJSON().order
  } else {
    const orderAndAliasTableName = `roles_${tableName}`
    if (obj[orderAndAliasTableName]) {
      let [orderAndAliasTableRow] = obj[orderAndAliasTableName]
      orderAndAliasTableRow = orderAndAliasTableRow.toJSON()
      order = orderAndAliasTableRow.o || orderAndAliasTableRow.order
    }
  }

  return (
    `${obj.id}!${obj.name}!${obj._modelOptions.name.singular}!${order}`
  )
}

const getIndividualNestedSitemap = contents => {
  const nestedSitemap = d3.nest()
    .key(d => getGroupByKey(d.card.page.dashboard.dashboard))
    .key(d => getGroupByKey(d.card.page.dashboard))
    .key(d => getGroupByKey(d.card.page))
    .key(d => getGroupByKey(d.card))
    .key(d => getGroupByKey(d))
    .object(contents)

  return nestedSitemap
}

const nestEachRoleSitemap = ({ roles }) => (
  roles.map(({ contents }) => getIndividualNestedSitemap(contents))
)

const mergeRolesSitemaps = rolesSitemaps => _.merge({}, ...rolesSitemaps)

const formatSitemap = sitemapObj => {
  // base case
  const keys = Object.keys(sitemapObj)
  const firstKey = keys[0]
  const firstValue = sitemapObj[firstKey]

  if (Array.isArray(firstValue)) {
    const result = _.map(sitemapObj, value => {
      const contentObj = value[0].toJSON()
      const { name, component, id, roles_contents: { order } } = contentObj

      return { name, component, id, order, type: 'content' }
    })

    return result
  }

  // iterative step
  const result = _.map(sitemapObj, (value, key) => {
    const [id, name, type, order] = key.split('!')

    return {
      id: Number(id),
      name,
      type,
      order: Number(order),
      children: formatSitemap(value)
    }
  })

  return result
}

const processSingleUserSitemaps = rawUserSitemaps => {
  const { dataValues: { id: _id, username } } = rawUserSitemaps
  const rolesSitemaps = nestEachRoleSitemap(rawUserSitemaps)
  const mergedSitemap = mergeRolesSitemaps(rolesSitemaps)
  const formattedSitemap = formatSitemap(mergedSitemap)

  return {
    _id,
    username,
    sitemap: formattedSitemap
  }
}

const processRawUsersSitemaps = rawUsersSitemaps => {
  const UsersSitemaps = rawUsersSitemaps.map(processSingleUserSitemaps)
  return UsersSitemaps
}

module.exports = processRawUsersSitemaps
