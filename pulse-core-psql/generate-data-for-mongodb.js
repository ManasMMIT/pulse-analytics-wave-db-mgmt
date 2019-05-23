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

  const queryToGetAllAccessibleNodes = `
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

module.exports = generateDataForMongoDb

  // // get all the users who have sitemaps
  // await User.findAll(
  //   {
  //     duplicating: true,
  //     required: true,
  //     include: [
  //       {
  //         model: Role,
  //         duplicating: true,
  //         required: true,
  //         include: [
  //           {
  //             model: Node,
  //             duplicating: true,
  //             required: true,
  //             where: { type: 'sitemap' }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // )

  // // get all the roles that currently have sitemaps
  // await Role.findAll(
  //   {
  //     duplicating: true,
  //     required: true,
  //     include: [
  //       {
  //         model: Node,
  //         duplicating: true,
  //         required: true,
  //         where: { type: 'sitemap' }
  //       }
  //     ]
  //   }
  // )

  // // get users.nodes.resources
  // const rawUsersNodesResources = await User.findAll(
  //   {
  //     duplicating: true,
  //     required: true,
  //     include: [
  //       {
  //         model: Role,
  //         through: { attributes: [] },
  //         duplicating: true,
  //         required: true,
  //         include: [
  //           {
  //             model: RoleNode,
  //             duplicating: true,
  //             required: true,
  //             include: [
  //               {
  //                 model: Resource,
  //                 duplicating: true,
  //                 required: true,
  //                 include: [
  //                   {
  //                     model: RegionalBreakdown,
  //                     as: 'regionalBreakdown',
  //                     duplicating: true,
  //                     required: true,
  //                     include: [
  //                       {
  //                         model: sequelize.models.us_states_regions,
  //                         duplicating: true,
  //                         required: true,
  //                         as: 'bsr',
  //                       }
  //                     ]
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ],
  //       },
  //     ],
  //   },
  // )

  // const allStates = await sequelize.models.us_state.findAll()
  // const allRegions = await sequelize.models.region.findAll()
  // const statesByKey = _.keyBy(allStates, 'id')
  // const regionsByKey = _.keyBy(allRegions, 'id')

  // const usersNodesResources = processRawUsersNodesResources({
  //   rawUsersNodesResources,
  //   statesByKey,
  //   regionsByKey,
  // })

  // // get users.sitemaps
  // const rawUsersSitemaps = await User.findAll(
  //   {
  //     duplicating: true,
  //     required: true,
  //     order: [
  //       [
  //         sequelize.col('roles->nodes->card->page->dashboard->dashboard->roles_dashboards.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->nodes->card->page->dashboard->roles_dashboards.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->nodes->card->page->roles_pages.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->nodes->card->roles_cards.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->nodes->roles_nodes.order'),
  //         'ASC',
  //       ],
  //     ],
  //     include: [
  //       {
  //         model: Role,
  //         duplicating: true,
  //         required: true,
  //         through: { attributes: [] },
  //         include: [
  //           {
  //             model: Node,
  //             duplicating: true,
  //             required: true,
  //             include: [
  //               {
  //                 model: Card,
  //                 duplicating: true,
  //                 required: true,
  //                 include: [
  //                   {
  //                     model: Page,
  //                     duplicating: true,
  //                     required: true,
  //                     include: [
  //                       {
  //                         model: RolePage,
  //                         duplicating: true,
  //                         required: true,
  //                         where: rolePageWhereCond,
  //                       },
  //                       {
  //                         model: Dashboard,
  //                         duplicating: true,
  //                         required: true,
  //                         include: [
  //                           {
  //                             model: Dashboard,
  //                             duplicating: true,
  //                             required: true,
  //                             include: [
  //                               {
  //                                 model: RoleDashboard,
  //                                 duplicating: true,
  //                                 required: true,
  //                                 where: roleTopDashboardWhereCond,
  //                               }
  //                             ]
  //                           },
  //                           {
  //                             model: RoleDashboard,
  //                             duplicating: true,
  //                             required: true,
  //                             where: roleLowerDashboardWhereCond,
  //                           },
  //                         ]
  //                       },
  //                     ]
  //                   },
  //                   {
  //                     model: RoleCard,
  //                     duplicating: true,
  //                     required: true,
  //                     where: roleCardWhereCond,
  //                   },
  //                 ]
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // )

  // const usersSitemaps = processRawUsersSitemaps(rawUsersSitemaps)
