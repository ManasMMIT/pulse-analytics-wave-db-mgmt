require('dotenv').load()
const Sequelize = require('sequelize')
const d3 = require('d3-collection')
const _ = require('lodash')

const DB_LOCAL_LOADER_URI = require('./db.config.js')
const DB_PROD_LOADER_URI = process.env.DB_PROD_LOADER_URI
const createUsersRolesClients = require('./create-users-roles-clients')
const createDashboards = require('./create-dashboards')
const createPages = require('./create-pages')
const createCards = require('./create-cards')
const createContents = require('./create-contents')
const createResources = require('./create-resources')
const createPermissions = require('./create-permissions')

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

  const { User, Role, Client } = await createUsersRolesClients(sequelize, false)
  const Dashboard = await createDashboards(sequelize, false)
  const Page = await createPages(sequelize, Dashboard, false)
  const Card = await createCards(sequelize, Page, false)
  const Content = await createContents(sequelize, Card, false)

  const Resource = await createResources(sequelize, false)
  const Permission = await createPermissions({
    sequelize,
    Role,
    Content,
    Resource,
    shouldSeed: false
  })

  // is there a way to get the following?
  // User.dashboards.dashboards.pages.cards.contents.contents.resource

  Role.belongsToMany(Content, { through: Permission })

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

  // get users.sitemaps
  const UsersSitemaps = await User.findOne(
    {
      where: { id: 'auth0|59e910a4c30a38053ab5452b' },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          include: [
            {
              model: Content,
              include: [
                {
                  model: Card,
                  include: [
                    {
                      model: Page,
                      include: [
                        {
                          model: Dashboard,
                          include: [
                            {
                              model: Dashboard
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
              ]
            },
          ],
        },
      ],
    },
  )

  const sampleContents = UsersSitemaps.roles[0].contents

  const getGroupByKey = obj => `${obj.id}!${obj.name}!${obj._modelOptions.name.singular}`

  const testNestObject = d3.nest()
    .key(d => getGroupByKey(d.card.page.dashboard.dashboard))
    .key(d => getGroupByKey(d.card.page.dashboard))
    .key(d => getGroupByKey(d.card.page))
    .key(d => getGroupByKey(d.card))
    .key(d => getGroupByKey(d))
    .object(sampleContents)

  // then merge the results of nesting across roles here

  // _.merge([nested1, nested2])

  // then format for actual usability on frontend

  const formatSitemap = sitemapObj => {
    // base case
    const keys = Object.keys(sitemapObj)
    const firstKey = keys[0]
    const firstValue = sitemapObj[firstKey]

    if (Array.isArray(firstValue)) {
      const result = _.map(sitemapObj, value => {
        const contentObj = value[0].toJSON()
        const { name, component, id } = contentObj

        return { name, component, id, type: 'content ' }
      })

      return result
    }

    // iterative step
    const result = _.map(sitemapObj, (value, key) => {
      const [id, name, type] = key.split('!')

      return {
        id: Number(id),
        name,
        type,
        children: formatSitemap(value)
      }
    })

    return result
  }

  const formattedSitemap = formatSitemap(testNestObject)

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

// Good links:
// https://stackoverflow.com/questions/38601223/sequelize-eager-loading-through-intermediate-model
// https://stackoverflow.com/questions/42708811/has-many-through-association-in-sequelize
// https://github.com/sequelize/sequelize/issues/7778

executeDbOperations()
