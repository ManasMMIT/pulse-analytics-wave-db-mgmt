const _ = require('lodash')
const Op = require('sequelize').Op
const mergeSitemapsAcrossRoles = require('./merge-roles-sitemaps')

const formatJson = ({ kids }) => {
  let arrayifiedObject = _.map(kids, obj => {
    if (obj.kids) obj.kids = formatJson(obj)
    return obj
  })

  arrayifiedObject = _.sortBy(arrayifiedObject, 'order')

  return arrayifiedObject
}

const queryAllAccessibleNodes = `
  SELECT
    nodes.id,
    nodes.type,
    COALESCE(roles_nodes.name, nodes.name) as name,
    COALESCE(roles_nodes.subtitle, nodes.subtitle) as subtitle,
    COALESCE(roles_nodes.caption, nodes.caption) as caption,
    COALESCE(roles_nodes.order, nodes.order) as order,
    COALESCE(roles_nodes."componentPath", nodes."componentPath") as "componentPath"
  FROM nodes
  JOIN roles_nodes
  ON nodes.id = roles_nodes."nodeId"
  JOIN roles
  ON roles.id = roles_nodes."roleId"
  WHERE roles.id = :roleId
`

/* to try the above section on its own, run the following in console */

// sequelize.query(
//   queryAllAccessibleNodes,
//   { type: sequelize.QueryTypes.SELECT }
// ).then(console.log)

const queryFromRootDown = `
  nodes_from_parents AS (
    SELECT
      id,
      type,
      name,
      subtitle,
      caption,
      accessible_nodes.order,
      "componentPath",
      null::uuid as "parentId"
    FROM accessible_nodes
    WHERE accessible_nodes.id NOT IN (SELECT "childId" FROM n2n)

    UNION ALL

    SELECT
      "childId" as id,
      accessible_nodes.type,
      accessible_nodes.name,
      accessible_nodes.subtitle,
      accessible_nodes.caption,
      accessible_nodes.order,
      accessible_nodes."componentPath",
      n2n."parentId" as "parentId"
    FROM nodes_from_parents
    JOIN n2n
    ON n2n."parentId" = nodes_from_parents.id
    JOIN accessible_nodes
    ON "childId" = accessible_nodes.id
  )
`

/*
  The above queryFromRootDown cannot be individually executed without
  queryAllAccessibleNodes feeding into it. Test it by running the query
  below, which draws on queryAllAccessibleNodes.
*/

// sequelize.query(
//   `
//     WITH RECURSIVE accessible_nodes AS (${ queryAllAccessibleNodes}),
//     ${ queryFromRootDown }
//     SELECT * FROM nodes_from_parents
//   `,
//   { type: sequelize.QueryTypes.SELECT }
// ).then(console.log)

const initialGroupByParentQuery = `
  SELECT
    "parentId" as id,
    jsonb_object_agg(
      id,
      jsonb_build_object('name', name)
        || jsonb_build_object('id', id)
        || jsonb_build_object('parentId', "parentId")
        || jsonb_build_object('type', type)
        || jsonb_build_object('subtitle', subtitle)
        || jsonb_build_object('caption', caption)
        || jsonb_build_object('order', nodes_from_parents.order)
        || jsonb_build_object('componentPath', "componentPath")
    ) AS kids
  FROM nodes_from_parents
  GROUP BY "parentId"
`

/*
  The above query also depends on the queries that come before it.
  Test it by running the query below, which draws on the previous queries.
*/

// await sequelize.query(
//   `
//     WITH RECURSIVE accessible_nodes AS (${ queryAllAccessibleNodes}),
//     ${ queryFromRootDown},
//     nodes_from_children AS (${initialGroupByParentQuery})
//     SELECT *
//     FROM nodes_from_children
//   `,
//   { type: sequelize.QueryTypes.SELECT }
// ).then(console.log)

const recursivelyAddNodesToTree = `
  SELECT
    "parentId" as id,
    jsonb_build_object(
      id,
      jsonb_build_object('name', name)
        || jsonb_build_object('id', id)
        || jsonb_build_object('parentId', "parentId")
        || jsonb_build_object('type', type)
        || jsonb_build_object('subtitle', subtitle)
        || jsonb_build_object('caption', caption)
        || jsonb_build_object('order', nodes_from_parents.order)
        || jsonb_build_object('kids', kids)
        || jsonb_build_object('componentPath', "componentPath")
    ) AS kids
  FROM nodes_from_children
  JOIN nodes_from_parents
  USING(id)
`

const fullRecursiveQuery = `
  WITH RECURSIVE accessible_nodes AS (${ queryAllAccessibleNodes }),
  ${ queryFromRootDown},
  nodes_from_children AS (
    ${ initialGroupByParentQuery}
    UNION ALL
    ${ recursivelyAddNodesToTree}
  )
  SELECT *
  FROM nodes_from_children
  WHERE id IS NULL
  LIMIT 200
`

const executeRecursiveQuery = async ({ sequelize, roleId }) => {
  return sequelize.query(
    fullRecursiveQuery,
    {
      replacements: { roleId },
      type: sequelize.QueryTypes.SELECT,
    }
  ).then(queryResult => {
    const mergedSitemap = _.merge({}, ...queryResult)
    return mergedSitemap
  })
}

const processUsersSitemaps = async ({
  sequelize,
  User,
  Role,
  Node,
}) => {
  // find all roles who have nodes
  const roles = await Role.findAll({
    attributes: ['id'],
    include: [{ model: Node, required: true }]
  })

  const roleIds = roles.map(({ id }) => id)

  const rolesSitemapsMap = {}
  for (const roleId of roleIds) {
    const sitemap = await executeRecursiveQuery({ sequelize, roleId })
    rolesSitemapsMap[roleId] = sitemap
  }

  // find all users who have nodes
  const users = await User.findAll({
    include: [
      {
        model: Role,
        where: { id: { [Op.in]: roleIds } }
      }
    ]
  })

  const usersSitemaps = users.map(user => {
    const sitemapAcrossRoles = mergeSitemapsAcrossRoles(user.roles, rolesSitemapsMap)
    const [formattedSitemap] = formatJson(sitemapAcrossRoles)

    return {
      _id: user.id,
      username: user.username,
      sitemap: formattedSitemap,
    }
  })

  const rolesSitemaps = _.reduce(rolesSitemapsMap, (acc, sitemapRaw, roleId) => {
    const [formattedSitemap] = formatJson(sitemapRaw)
    acc[roleId] = formattedSitemap
    return acc
  }, {})

  return { usersSitemaps, rolesSitemaps }
}

module.exports = processUsersSitemaps
