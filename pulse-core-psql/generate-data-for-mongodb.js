const _ = require('lodash')
const connectToPsql = require('./connect-to-psql')

const {
  createUsersRolesClients,
  createNodes,
  // createResources,
  // createPermissions,
  createRolesNodes,
  // createRegionalTables,
} = require('./create-tables-util')

// const processRawUsersNodesResources = require('./process-users-nodes-resources')
// const processRawUsersSitemaps = require('./process-users-sitemaps')

const generateDataForMongoDb = async () => {
  const sequelize = await connectToPsql()

  const { User, Role, Client } = await createUsersRolesClients({ sequelize, shouldSeed: false })
  const Node = await createNodes({ sequelize, shouldSeed: false })

  const RoleNode = await createRolesNodes({
    sequelize,
    Role,
    Node,
    shouldSeed: true,
  })

  return { User, Role, Client, Node, RoleNode }

  // // regional breakdown can only be seeded by uploading CSV
  // const RegionalBreakdown = await createRegionalTables({ sequelize })

  // const Resource = await createResources({
  //   sequelize,
  //   RegionalBreakdown,
  //   shouldSeed: false,
  // })

  // const Permission = await createPermissions({
  //   sequelize,
  //   RoleNode,
  //   Resource,
  //   shouldSeed: false,
  // })

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
  // const roleTopDashboardWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->nodes->card->page->dashboard->dashboard->roles_dashboards.roleId'),
  // )

  // const roleLowerDashboardWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->nodes->card->page->dashboard->roles_dashboards.roleId'),
  // )

  // const rolePageWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->nodes->card->page->roles_pages.roleId'),
  // )

  // const roleCardWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->nodes->card->roles_cards.roleId'),
  // )

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

  return {
    // usersNodesResources,
    // usersSitemaps
  }
}

module.exports = generateDataForMongoDb

// // get masterSitemap
// let masterSitemap = await Dashboard.findAll(
//   {
//     include: [
//       {
//         model: Dashboard,
//         as: 'ChildDashboard',
//         include: [
//           {
//             model: Page,
//             include: [
//               {
//                 model: Card,
//                 include: [
//                   {
//                     model: Node,
//                   }
//                 ]
//               }
//             ]
//           }
//         ],
//       }
//     ]
//   }
// )
