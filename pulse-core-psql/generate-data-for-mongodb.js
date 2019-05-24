const _ = require('lodash')
const initializeTables = require('./initialize-tables')

// const processRawUsersNodesResources = require('./process-users-nodes-resources')
// const processRawUsersSitemaps = require('./process-users-sitemaps')

const generateDataForMongoDb = async () => {
  const {
    sequelize,
    User,
    Role,
    Client,
    Node,
    RoleNode,
    RegionalBreakdown,
    Resource,
    Permission,
  } = await initializeTables()

  await Role.findOne(
    {
      where: { id: 'c04bfb71-9314-4a51-be72-480c3d7c82cf' },
      include: [
        {
          model: Node,
          duplicating: true,
          required: true,
        },
      ],
    }
  )

  await sequelize.query(`
    SELECT *, (
      SELECT * FROM nodes
      JOIN roles_nodes
      ON nodes.id = roles_nodes."nodeId"
      JOIN roles
      ON roles.id = roles_nodes."roleId"
      WHERE roles.id = 'c04bfb71-9314-4a51-be72-480c3d7c82cf'
    ) as targetNodes
    JOIN n2n
    ON targetNodes.id = n2n.parentId
    JOIN targetNodes.id = n2n.childId
  `)

  queryToGetAllAccessibleNodes = `
    SELECT
      nodes.id, nodes.name, nodes.type, roles_nodes.order
    FROM
      nodes
    JOIN
      roles_nodes
    ON
      nodes.id = roles_nodes."nodeId"
    JOIN
      roles
    ON
      roles.id = roles_nodes."roleId"
    WHERE
      roles.id = 'c04bfb71-9314-4a51-be72-480c3d7c82cf'
    `

  await sequelize.query(queryToGetAllAccessibleNodes)

  await sequelize.query(`
    SELECT
      nodes.id, nodes.name, nodes.type, nodes.order, n2n."childId", n2n."parentId"
    FROM (${queryToGetAllAccessibleNodes}) AS nodes
    JOIN
      n2n
    ON
      n2n."parentId" = nodes.id
  `)

  return {
    // usersNodesResources,
    // usersSitemaps
  }
}

queryToGetAllAccessibleNodes = `
  SELECT nodes.id, nodes.name, nodes.type, roles_nodes.order
  FROM nodes
  JOIN roles_nodes
  ON nodes.id = roles_nodes."nodeId"
  JOIN roles
  ON roles.id = roles_nodes."roleId"
  WHERE roles.id = 'c04bfb71-9314-4a51-be72-480c3d7c82cf'
`

await sequelize.query(queryToGetAllAccessibleNodes)

PART_recursionQueryTopDown = `
  WITH RECURSIVE nodes_from_parents AS (
    SELECT id, name, '{}'::uuid[] as parents, 0 as level
    FROM (${queryToGetAllAccessibleNodes}) AS c
    WHERE c.id NOT IN (SELECT "childId" FROM n2n)

    UNION ALL

    SELECT c2.id, c2.name, parents || n2n_1."parentId", level+1
    FROM nodes_from_parents AS p
    JOIN n2n as n2n_1
    ON n2n_1."parentId" = p.id
    JOIN (${queryToGetAllAccessibleNodes}) AS c2
    ON n2n_1."childId" = c2.id
    WHERE NOT c2.id = any(parents)
  )
`
STANDALONE_recursionQueryTopDown = `
  ${PART_recursionQueryTopDown}
  SELECT *
  FROM nodes_from_parents
`
await sequelize.query(STANDALONE_recursionQueryTopDown)

BOTTOM_UP_PART_1_recursionQuery = `
  SELECT
    pcj."parentId",
    json_agg(
      jsonb_build_object('name', tree.name)
      || jsonb_build_object('id', tree.id)
      || jsonb_build_object('parentId', pcj."parentId")
    )::jsonb AS js
  FROM nodes_from_parents AS tree
  JOIN (SELECT "parentId", "childId" FROM n2n) as pcj
  ON pcj."childId" = tree.id
  WHERE pcj."parentId" IN (SELECT "id" FROM nodes_from_parents)
  GROUP BY pcj."parentId"
`
BOTTOM_UP_PART_2_recursionQuery = `
  SELECT
    pcj2."parentId",
    jsonb_build_object('name', c4.name)
      || jsonb_build_object('id', c4.id)
      || jsonb_build_object('parentId', pcj2."parentId")
      || jsonb_build_object('kids', js)
    AS js
  FROM nodes_from_children AS tree2
  JOIN n2n AS pcj2
  ON pcj2."childId" = tree2."parentId"
  JOIN nodes AS c4
  ON c4.id = pcj2."childId"
  WHERE pcj2."parentId" IN (SELECT "id" FROM nodes_from_parents)
`

FULL_recursionQuery = `
  ${PART_recursionQueryTopDown},
    nodes_from_children AS (
    ${BOTTOM_UP_PART_1_recursionQuery}
    UNION ALL
    ${BOTTOM_UP_PART_2_recursionQuery}
  )
  SELECT jsonb_agg(js)
  FROM nodes_from_children
`

await sequelize.query(FULL_recursionQuery)

// PAUSING ON THE BELOW BECAUSE IT'S GETTING CONFUSING
// recursionQueryBottomUp = `
//   WITH RECURSIVE nodes_from_parents AS (${recursionQueryTopDown}),
//   nodes_from_children AS (
//     SELECT
//       pcj."parentId",
//       json_agg(
//         jsonb_build_object('name', c.name)
//         || jsonb_build_object('id', c.id)
//         || jsonb_build_object('parentId', pcj."parentId")
//       )::jsonb AS js
//     FROM nodes_from_parents AS tree
//     LEFT JOIN (SELECT "parentId", "childId" FROM n2n) as pcj
//     ON pcj."childId" = tree.id
//     LEFT JOIN nodes as c
//     ON c.id = pcj."parentId"
//     WHERE level > 0 AND NOT id = any(parents)
//     GROUP BY pcj."parentId"
//   )
//   SELECT jsonb_agg(js)
//   FROM nodes_from_children
// `
// await sequelize.query(recursionQueryBottomUp)

// `

    // UNION ALL

    // SELECT
    //   pcj2."parentId",
    //   jsonb_build_object('name', c2.name)
    //     || jsonb_build_object('id', c2.id)
    //     || jsonb_build_object('parentId', pcj2."parentId")
    //     || jsonb_build_object('kids', js) AS js
    // FROM nodes_from_children AS tree2
    // JOIN n2n AS pcj2
    // ON pcj2."childId" = tree2."parentId"
    // JOIN nodes AS c2
    // ON c2.id = pcj2."childId"
// `

// recursionQueryBottomUp = `
//   WITH RECURSIVE nodes_from_parents AS (${recursionQueryTopDown}),
//   nodes_from_children AS (
//     SELECT n2n."parentId", json_agg(jsonb_build_object('name', c.name))::jsonb as js
//     FROM nodes_from_parents AS tree
//     JOIN (SELECT "parentId", "childId" from n2n) as n2n
//     ON n2n."childId" = tree.id
//     JOIN nodes AS c
//     USING(id)
//     WHERE level > 0 AND NOT id = any(parents)
//     GROUP BY n2n."parentId"

//     UNION ALL

//     SELECT
//       asdf."parentId",
//       jsonb_build_object('name', c.name) || jsonb_build_object('kids', js) as js
//     FROM nodes_from_children AS tree
//     JOIN n2n as asdf
//     ON asdf."childId" = tree."parentId"
//     JOIN nodes AS c
//     ON c.id = asdf."parentId"
//   )
//   SELECT jsonb_agg(js)
//   FROM nodes_from_children
// `

// `
//   SELECT n2n."parentId", json_agg(jsonb_build_object('name', n2n.name))::jsonb as js
//   FROM nodes_from_parents AS tree
//   JOIN n2n
//   ON n2n."childId" = tree.id
//   JOIN nodes as c
//   ON n2n."parentId" = c.id using(id)
//   WHERE level > 0 AND NOT id = any(parents)
//   GROUP BY n2n."parentId"

//   UNION ALL

//   SELECT
//   n2n."parentId",
//     jsonb_build_object('name', n2n.name) || jsonb_build_object('Sub Classes', js) as js
//   FROM nodes_from_children AS tree
//   JOIN
// `


// module.exports = generateDataForMongoDb

//   // // get all the users who have sitemaps
//   // await User.findAll(
//   //   {
//   //     duplicating: true,
//   //     required: true,
//   //     include: [
//   //       {
//   //         model: Role,
//   //         duplicating: true,
//   //         required: true,
//   //         include: [
//   //           {
//   //             model: Node,
//   //             duplicating: true,
//   //             required: true,
//   //             where: { type: 'sitemap' }
//   //           }
//   //         ]
//   //       }
//   //     ]
//   //   }
//   // )

//   // // get all the roles that currently have sitemaps
//   // await Role.findAll(
//   //   {
//   //     duplicating: true,
//   //     required: true,
//   //     include: [
//   //       {
//   //         model: Node,
//   //         duplicating: true,
//   //         required: true,
//   //         where: { type: 'sitemap' }
//   //       }
//   //     ]
//   //   }
//   // )

//   // // get users.nodes.resources
//   // const rawUsersNodesResources = await User.findAll(
//   //   {
//   //     duplicating: true,
//   //     required: true,
//   //     include: [
//   //       {
//   //         model: Role,
//   //         through: { attributes: [] },
//   //         duplicating: true,
//   //         required: true,
//   //         include: [
//   //           {
//   //             model: RoleNode,
//   //             duplicating: true,
//   //             required: true,
//   //             include: [
//   //               {
//   //                 model: Resource,
//   //                 duplicating: true,
//   //                 required: true,
//   //                 include: [
//   //                   {
//   //                     model: RegionalBreakdown,
//   //                     as: 'regionalBreakdown',
//   //                     duplicating: true,
//   //                     required: true,
//   //                     include: [
//   //                       {
//   //                         model: sequelize.models.us_states_regions,
//   //                         duplicating: true,
//   //                         required: true,
//   //                         as: 'bsr',
//   //                       }
//   //                     ]
//   //                   }
//   //                 ]
//   //               }
//   //             ]
//   //           }
//   //         ],
//   //       },
//   //     ],
//   //   },
//   // )

//   // const allStates = await sequelize.models.us_state.findAll()
//   // const allRegions = await sequelize.models.region.findAll()
//   // const statesByKey = _.keyBy(allStates, 'id')
//   // const regionsByKey = _.keyBy(allRegions, 'id')

//   // const usersNodesResources = processRawUsersNodesResources({
//   //   rawUsersNodesResources,
//   //   statesByKey,
//   //   regionsByKey,
//   // })

//   // // get users.sitemaps
//   // const rawUsersSitemaps = await User.findAll(
//   //   {
//   //     duplicating: true,
//   //     required: true,
//   //     order: [
//   //       [
//   //         sequelize.col('roles->nodes->card->page->dashboard->dashboard->roles_dashboards.order'),
//   //         'ASC',
//   //       ],
//   //       [
//   //         sequelize.col('roles->nodes->card->page->dashboard->roles_dashboards.order'),
//   //         'ASC',
//   //       ],
//   //       [
//   //         sequelize.col('roles->nodes->card->page->roles_pages.order'),
//   //         'ASC',
//   //       ],
//   //       [
//   //         sequelize.col('roles->nodes->card->roles_cards.order'),
//   //         'ASC',
//   //       ],
//   //       [
//   //         sequelize.col('roles->nodes->roles_nodes.order'),
//   //         'ASC',
//   //       ],
//   //     ],
//   //     include: [
//   //       {
//   //         model: Role,
//   //         duplicating: true,
//   //         required: true,
//   //         through: { attributes: [] },
//   //         include: [
//   //           {
//   //             model: Node,
//   //             duplicating: true,
//   //             required: true,
//   //             include: [
//   //               {
//   //                 model: Card,
//   //                 duplicating: true,
//   //                 required: true,
//   //                 include: [
//   //                   {
//   //                     model: Page,
//   //                     duplicating: true,
//   //                     required: true,
//   //                     include: [
//   //                       {
//   //                         model: RolePage,
//   //                         duplicating: true,
//   //                         required: true,
//   //                         where: rolePageWhereCond,
//   //                       },
//   //                       {
//   //                         model: Dashboard,
//   //                         duplicating: true,
//   //                         required: true,
//   //                         include: [
//   //                           {
//   //                             model: Dashboard,
//   //                             duplicating: true,
//   //                             required: true,
//   //                             include: [
//   //                               {
//   //                                 model: RoleDashboard,
//   //                                 duplicating: true,
//   //                                 required: true,
//   //                                 where: roleTopDashboardWhereCond,
//   //                               }
//   //                             ]
//   //                           },
//   //                           {
//   //                             model: RoleDashboard,
//   //                             duplicating: true,
//   //                             required: true,
//   //                             where: roleLowerDashboardWhereCond,
//   //                           },
//   //                         ]
//   //                       },
//   //                     ]
//   //                   },
//   //                   {
//   //                     model: RoleCard,
//   //                     duplicating: true,
//   //                     required: true,
//   //                     where: roleCardWhereCond,
//   //                   },
//   //                 ]
//   //               },
//   //             ],
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   },
//   // )

//   // const usersSitemaps = processRawUsersSitemaps(rawUsersSitemaps)
