const d3 = require('d3-collection')
const _ = require('lodash')
const connectToPsql = require('./connect-to-psql')
const { getScriptTerminator } = require('../utils')

const {
  createUsersRolesClients,
  createDashboards,
  createPages,
  createCards,
  createContents,
  createResources,
  createPermissions,
  createRolesDashboards,
  createRolesPages,
  createRolesCards,
  createRegionalTables,
} = require('./initializeTables')

// const processUsersContentsResourcesRaw = require('./process-users-contents-resources')
// const processUsersSitemapsRaw = require('./process-users-sitemaps')

let terminateScript

const executeDbOperations = async () => {
  const sequelize = await connectToPsql()
  terminateScript = getScriptTerminator(sequelize)

  const { User, Role, Client } = await createUsersRolesClients({ sequelize, shouldSeed: false })
  const Dashboard = await createDashboards({ sequelize, shouldSeed: false })
  const Page = await createPages({ sequelize, Dashboard, shouldSeed: false })
  const Card = await createCards({ sequelize, Page, shouldSeed: false })
  const Content = await createContents({ sequelize, Card, shouldSeed: false })

  // regional breakdown can only be seeded by uploading CSV
  const RegionalBreakdown = await createRegionalTables({ sequelize })

  const Resource = await createResources({
    sequelize,
    RegionalBreakdown,
    shouldSeed: false,
  })

  const Permission = await createPermissions({
    sequelize,
    Role,
    Content,
    Resource,
    shouldSeed: false,
  })

  Role.belongsToMany(Content, { through: Permission })

  const RoleDashboard = await createRolesDashboards({
    sequelize,
    Role,
    Dashboard,
    shouldSeed: false,
  })

  const RolePage = await createRolesPages({
    sequelize,
    Role,
    Page,
    shouldSeed: false,
  })

  const RoleCard = await createRolesCards({
    sequelize,
    Role,
    Card,
    shouldSeed: false,
  })

  // is there a way to get the following?
  // User.dashboards.dashboards.pages.cards.contents.contents.resource

  // get users.contents.resources in rawer form
  const UsersContentsResourcesRaw = await User.findOne(
    {
      where: { id: 'auth0|59e910a4c30a38053ab5452b' },
      duplicating: true,
      required: true,
      include: [
        {
          model: Role,
          through: { attributes: [] },
          duplicating: true,
          required: true,
          include: [
            {
              model: Permission,
              duplicating: true,
              required: true,
              include: [
                {
                  model: Content,
                  duplicating: true,
                  required: true,
                },
                {
                  model: Resource,
                  duplicating: true,
                  required: true,
                  // include: [
                  //   {
                  //     model: RegionalBreakdown,
                  //     duplicating: true,
                  //     required: true,
                  //     include: [
                  //       {
                  //         model: sequelize.models.us_states_regions,
                  //         // duplicating: true,
                  //         required: true,
                  //         as: 'statesRegions',
                  //       }
                  //     ]
                  //   }
                  // ]
                },
              ]
            },
          ],
        },
      ],
    },
  )

  const samplePermissions = UsersContentsResourcesRaw.roles[0].permissions
  const uniquePermByResource = _.uniqBy(samplePermissions, ({ resource }) => resource.id)

  const resources = await Promise.all(
    uniquePermByResource.map(perm => perm.resource.getRegional_breakdown())
  )

  const usStateRegions = await Promise.all(
    resources.map(resource => resource.getUs_states_regions())
  )

  const allStates = await sequelize.models.us_state.findAll()
  const statesByKey = _.keyBy(allStates, 'id')
  const allRegions = await sequelize.models.region.findAll()
  const regionsByKey = _.keyBy(allRegions, 'id')

  const testResult = usStateRegions.map(arr => (
    arr.map(({ stateId, regionId }) => {
      const state = statesByKey[stateId].toJSON()
      const region = regionsByKey[regionId].toJSON()
      return { state, region }
    })
  ))

  debugger

  // const sampleNestPermissions = d3.nest()
  //   .key(d => d.contentId)
  //   .key(d => d.resourceId)
  //   .rollup(arr => {
  //     const resourceRefs = arr.map(({ resource }) => ({ resource }))

  //     const getResources = async () => {
  //       const result = []
  //       for (const resourceRef of resourceRefs) {
  //         if (resourceRef.type === 'regionalBreakdown') {
  //           const breakdown = await resourceRef.getRegionalBreakdown()
  //           result.push(breakdown)
  //         }
  //       }
  //       return result
  //     }

  //     const result = await getResources()
  //     return result
  //   })
  //   .object(samplePermissions)

  // merge the resources
  // _.merge({}, ...nestPermissions)

  // debugger

  // const UsersContentsResourcesFormatted = processUsersContentsResourcesRaw(UsersContentsResourcesRaw)
  // debugger

  // const roleTopDashboardWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->contents->card->page->dashboard->dashboard->roles_dashboards.roleId'),
  // )

  // const roleLowerDashboardWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->contents->card->page->dashboard->roles_dashboards.roleId'),
  // )

  // const rolePageWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->contents->card->page->roles_pages.roleId'),
  // )

  // const roleCardWhereCond = sequelize.where(
  //   sequelize.col('roles.id'),
  //   sequelize.col('roles->contents->card->roles_cards.roleId'),
  // )

  // // get users.sitemaps
  // const UsersSitemapsRaw = await User.findAll(
  //   {
  //     duplicating: true,
  //     required: true,
  //     order: [
  //       [
  //         sequelize.col('roles->contents->card->page->dashboard->dashboard->roles_dashboards.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->contents->card->page->dashboard->roles_dashboards.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->contents->card->page->roles_pages.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->contents->card->roles_cards.order'),
  //         'ASC',
  //       ],
  //       [
  //         sequelize.col('roles->contents->permission.order'),
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
  //             model: Content,
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

  // const UsersSitemapsFormatted = processUsersSitemapsRaw(UsersSitemapsRaw)

  // debugger

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
  //                     model: Content,
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

  // // JSONify the nested sitemap
  // let masterSitemap = masterSitemap.map(dashboard => dashboard.toJSON())
  // debugger
}

executeDbOperations().then(async () => {
  console.log('Closing psql connection...')
  await terminateScript()
})
