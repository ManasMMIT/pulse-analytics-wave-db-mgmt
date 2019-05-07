require('dotenv').load()
const Sequelize = require('sequelize')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI

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
} = require('./initializeTables')

const processUsersSitemapsRaw = require('./process-users-sitemaps')

const sslConfig = DB_PROD_LOADER_URI
  ? {
    ssl: true,
    dialectOptions: {
      ssl: { require: true }
    }
  }
  : {}

const sequelize = new Sequelize(DB_PROD_LOADER_URI || DB_LOCAL_LOADER_URI, {
  pool: {
    max: 150,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  ...sslConfig
})

const executeDbOperations = async () => {
  // Test connection
  await sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err)
    })

  const { User, Role, Client } = await createUsersRolesClients({ sequelize, shouldSeed: false })
  const Dashboard = await createDashboards({ sequelize, shouldSeed: false })
  const Page = await createPages({ sequelize, Dashboard, shouldSeed: false })
  const Card = await createCards({ sequelize, Page, shouldSeed: false })
  const Content = await createContents({ sequelize, Card, shouldSeed: false })

  const Resource = await createResources({ sequelize, shouldSeed: false })
  const Permission = await createPermissions({
    sequelize,
    Role,
    Content,
    Resource,
    shouldSeed: false
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
  // const UsersContentsResources = await User.findOne(
  //   {
  //     where: { id: 'auth0|59e910a4c30a38053ab5452b' },
  //     include: [
  //       {
  //         model: Role,
  //         through: { attributes: [] },
  //         include: [
  //           {
  //             model: Permission,
  //             include: [
  //               {
  //                 model: Content,
  //               },
  //               {
  //                 model: Resource,
  //               },
  //             ]
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // )

  const roleTopDashboardWhereCond = Sequelize.where(
    Sequelize.col('roles.id'),
    Sequelize.col('roles->contents->card->page->dashboard->dashboard->roles_dashboards.roleId'),
  )

  const roleLowerDashboardWhereCond = Sequelize.where(
    Sequelize.col('roles.id'),
    Sequelize.col('roles->contents->card->page->dashboard->roles_dashboards.roleId'),
  )

  const rolePageWhereCond = Sequelize.where(
    Sequelize.col('roles.id'),
    Sequelize.col('roles->contents->card->page->roles_pages.roleId'),
  )

  const roleCardWhereCond = Sequelize.where(
    Sequelize.col('roles.id'),
    Sequelize.col('roles->contents->card->roles_cards.roleId'),
  )

  // get users.sitemaps
  const UsersSitemapsRaw = await User.findOne(
    {
      where: { id: 'auth0|59e910a4c30a38053ab5452b' },
      duplicating: true,
      required: true,
      order: [
        [
          Sequelize.col('roles->contents->card->page->dashboard->dashboard->roles_dashboards.order'),
          'ASC',
        ],
        [
          Sequelize.col('roles->contents->card->page->dashboard->roles_dashboards.order'),
          'ASC',
        ],
        [
          Sequelize.col('roles->contents->card->page->roles_pages.order'),
          'ASC',
        ],
        [
          Sequelize.col('roles->contents->card->roles_cards.order'),
          'ASC',
        ],
        [
          Sequelize.col('roles->contents->permission.order'),
          'ASC',
        ],
      ],
      include: [
        {
          model: Role,
          duplicating: true,
          required: true,
          through: { attributes: [] },
          include: [
            {
              model: Content,
              duplicating: true,
              required: true,
              include: [
                {
                  model: Card,
                  duplicating: true,
                  required: true,
                  include: [
                    {
                      model: Page,
                      duplicating: true,
                      required: true,
                      include: [
                        {
                          model: RolePage,
                          duplicating: true,
                          required: true,
                          where: rolePageWhereCond,
                        },
                        {
                          model: Dashboard,
                          duplicating: true,
                          required: true,
                          include: [
                            {
                              model: Dashboard,
                              duplicating: true,
                              required: true,
                              include: [
                                {
                                  model: RoleDashboard,
                                  duplicating: true,
                                  required: true,
                                  where: roleTopDashboardWhereCond,
                                }
                              ]
                            },
                            {
                              model: RoleDashboard,
                              duplicating: true,
                              required: true,
                              where: roleLowerDashboardWhereCond,
                            },
                          ]
                        },
                      ]
                    },
                    {
                      model: RoleCard,
                      duplicating: true,
                      required: true,
                      where: roleCardWhereCond,
                    },
                  ]
                },
              ],
            },
          ],
        },
      ],
    },
  )

  const UsersSitemapsFormatted = processUsersSitemapsRaw(UsersSitemapsRaw)

  debugger

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

executeDbOperations()
