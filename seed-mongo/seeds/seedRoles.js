const _ = require('lodash');
const psql = require('./../sequelize')

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
  WITH RECURSIVE accessible_nodes AS (${ queryAllAccessibleNodes}),
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

const getRolesSitemapsMap = async () => {
  const roles = await psql.models.Role.findAll({
    attributes: ['id'],
    include: [{ model: psql.models.Node, required: true }]
  })

  const roleIds = roles.map(({ id }) => id)

  const rolesSitemapsMap = {}
  for (const roleId of roleIds) {
    const sitemap = await executeRecursiveQuery({ sequelize: psql.sequelize, roleId })
    rolesSitemapsMap[roleId] = sitemap
  }

  return rolesSitemapsMap
}

const formatJson = ({ kids }) => {
  let arrayifiedObject = _.map(kids, obj => {
    if (obj.kids) obj.kids = formatJson(obj)
    return obj
  })

  arrayifiedObject = _.sortBy(arrayifiedObject, 'order')

  return arrayifiedObject
}

module.exports = async (Role, db, pulseDev) => {
  const roles = await Role.findAll()

  const newRoles = []
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];

    const roleNodes = await psql.sequelize.query(
      `
        WITH RECURSIVE accessible_nodes AS (${ queryAllAccessibleNodes}),
        ${ queryFromRootDown}
        SELECT * FROM nodes_from_parents
      `,
      {
        replacements: { roleId: role.id },
        type: psql.sequelize.QueryTypes.SELECT
      }
    )
    const { tool, dashboard, page, card } = _.groupBy(roleNodes, 'type')

    const tools = _.orderBy(tool, ['parentId', 'order'])
      .map(node => {
        const _id = node.id
        delete node.id
        return {
          _id,
          text: {
            subtitle: node.subtitle,
            caption: node.caption,
          },
          ...node
        }
      })

    const dashboards = _.orderBy(dashboard, ['parentId', 'order'])
      .map(node => {
        const _id = node.id
        delete node.id
        return {
          _id,
          text: {
            subtitle: node.subtitle,
            caption: node.caption,
          },
          ...node
        }
      })

    const pages = _.orderBy(page, ['parentId', 'order'])
      .map(node => {
        const _id = node.id
        delete node.id
        return {
          _id,
          text: {
            subtitle: node.subtitle,
            caption: node.caption,
          },
          ...node
        }
      })

    const cards = _.orderBy(card, ['parentId', 'order'])
      .map(node => {
        const _id = node.id
        delete node.id
        return {
          _id,
          text: {
            subtitle: node.subtitle,
            caption: node.caption,
          },
          ...node
        }
      })

    const clients = await role.getClients({ raw: true })
    const hasClient = Boolean(clients.length);
    
    let client;
    if (!hasClient && !['admin', 'demo'].includes(role.name)) {
      continue;
    } else if (!hasClient) {
      client = null
    } else {
      client = {
        _id: clients[0].id,
        name: clients[0].name,
        description: clients[0].description,
      };
    }

    let users = await role.getUsers({ raw: true})

    users = users.map(({ id, username, email }) => ({
      _id: id,
      username,
      email,
    }));

    const rolesSitemapsMap = await getRolesSitemapsMap()

    const roleSitemap = rolesSitemapsMap[role.id]
    
    let finalSitemap = null
    if (roleSitemap) {
      finalSitemap = formatJson(roleSitemap)[0]
    }

    const newRole = {
      _id: role.id,
      name: role.name,
      description: role.description,
      client,
      sitemap: finalSitemap,
      newSitemap: {
        tools,
        dashboards,
        pages,
        cards,
      },
      users,
      schemaVersion: "v1.0.0"
    };

    newRoles.push(newRole);
  }

  const collection = db.collection("roles");
  await collection.insertMany(newRoles);
};
