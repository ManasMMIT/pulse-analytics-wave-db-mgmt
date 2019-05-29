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
}

module.exports = generateDataForMongoDb
